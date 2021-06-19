import { PrismaClient } from '@prisma/client';
import { DepGraph } from 'dependency-graph';
import { Fixture, IdentityModel, LinkMethod } from './fixture';
import ClassContainer from './loader';

type ImportFixtureOptions = {
	/** The prisma client on which to import the fixtures in. Uses the default prisma client if undefined. */
	prisma: PrismaClient;
	/**
	 * The path to the fixtures folder. Defaults to `./prisma/fixtures`. `.` refer to project's root.
	 *
	 * Example paths :
	 * - `${__dirname}/fixtures` - current directory's fixture folder
	 */
	fixturesPath: string;
	/** Close Prisma's database or not after importing all fixtures. Defaults to `true`. */
	doCloseDatabase: boolean;
};

function getSpecs(options?: Partial<ImportFixtureOptions>): ImportFixtureOptions {
	return {
		prisma: options?.prisma ?? new PrismaClient(),
		fixturesPath: options?.fixturesPath ?? './prisma/fixtures-ts',
		doCloseDatabase: options?.doCloseDatabase ?? true,
	};
}

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

/**
 *
 * @param options Options defining so behavior of the importation, such as the fixtures path and if the database should be closed.
 * @returns Promise containing the results of the seeds, tagged by their (class) name and their created models.
 * If an error occurred while seeding, the resulting promise will short-circuit to throw said error, respecting the given options.
 */
export async function loadFixtures(options?: Partial<ImportFixtureOptions>) {
	const specs = getSpecs(options);

	const fixtureContainer = new ClassContainer(Fixture, specs.fixturesPath);

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

					const models = await fixture.seed(specs.prisma, linkToThisFixtureFn);

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

		if (specs.doCloseDatabase) {
			await specs.prisma.$disconnect();
		}

		return result;
	} catch (error) {
		if (specs.doCloseDatabase) {
			await specs.prisma.$disconnect();
		}

		throw error;
	}
}

loadFixtures();
