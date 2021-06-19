import { PrismaClient } from '@prisma/client';
import { DepGraph } from 'dependency-graph';
import { Fixture, IdentityModel, LinkMethod } from './fixture';
import ClassContainer from './loader';

type DependenciesData = Record<string, IdentityModel[]>;

function createLinkFn(fixture: Fixture, depsData: DependenciesData): LinkMethod<Fixture> {
	return (dependency: typeof fixture['dependencies'][number], _options) => {
		const data: IdentityModel[] | undefined = depsData[dependency.name];

		if (!data?.length) {
			throw 'Data missing!';
		}

		const test = data[0];

		return test;
	};
}

export async function loadFixtures(folderPath = './prisma/fixtures-ts') {
	const prisma = new PrismaClient();

	const fixtureContainer = new ClassContainer(Fixture, folderPath);

	const fixtureInstances = await fixtureContainer.getDetailedInstances();

	const depGraph = new DepGraph<Fixture>();

	fixtureInstances.forEach(({ name, instance: fixture }) => {
		depGraph.addNode(name, fixture);
	});

	fixtureInstances.forEach(({ name, instance: fixture }) => {
		fixture.dependencies?.forEach((dep) => {
			depGraph.addDependency(name, dep.name);
		});
	});

	const order = depGraph.overallOrder();

	const dependenciesData: DependenciesData = {};

	try {
		const result = await order
			.map((fixtureName) => {
				return {
					name: fixtureName,
					fixture: depGraph.getNodeData(fixtureName),
				};
			})
			.map(({ name, fixture }) => {
				return async () => {
					const linkToThisFixtureFn = createLinkFn(fixture, dependenciesData);

					const models = await fixture.seed(prisma, linkToThisFixtureFn);

					dependenciesData[name] = models;

					return {
						name,
						models,
					};
				};
			})
			.reduce(
				(p, task) => p.then(async (prevResults = []) => [...prevResults, await task()]),
				Promise.resolve() as unknown as Promise<
					{
						name: string;
						models: IdentityModel[];
					}[]
				>,
			);

		await prisma.$disconnect();

		return result;
	} catch (error) {
		await prisma.$disconnect();

		throw error;
	}
}

loadFixtures();
