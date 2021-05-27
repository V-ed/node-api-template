import { Builder, fixturesIterator, Loader, Parser, Resolver } from '@getbigger-io/prisma-fixtures-cli';
import { PrismaClient } from '@prisma/client';
import { exec as execNoPromise } from 'child_process';
import path from 'path';
import util from 'util';

// Fixtures

type ImportFixtureOptions = {
	/** The prisma client on which to import the fixtures in. Uses the default prisma client if undefined. */
	prisma: PrismaClient;
	/**
	 * The path to the fixtures folder. Defaults to `./fixtures`. `.` refer to project's root.
	 *
	 * Example paths :
	 * - `${__dirname}/fixtures` - current directory's fixture folder
	 */
	fixturesPath: string;
	/** Close Prisma's database or not after importing all fixtures. Defaults to `true`. */
	doCloseDatabase: boolean;
};

/**
 * Implementation of {@link https://github.com/getbigger-io/prisma-fixtures|getbigger-io/prisma-fixtures}'s programmatic loading of fixtures.
 *
 * @param options Options defining so behavior of the importation, such as the fixtures path and if the database should be closed.
 * @returns The Prisma Client used for importing.
 */
export async function importFixtures(options?: Partial<ImportFixtureOptions>): Promise<PrismaClient> {
	const specs: ImportFixtureOptions = {
		prisma: options?.prisma ?? new PrismaClient(),
		fixturesPath: options?.fixturesPath ?? './prisma/fixtures',
		doCloseDatabase: options?.doCloseDatabase ?? true,
	};

	await specs.prisma.$connect();

	const loader = new Loader();

	const resolvedPath = path.resolve(specs.fixturesPath);

	loader.load(resolvedPath);

	const resolver = new Resolver();
	const fixtures = resolver.resolve(loader.fixtureConfigs);
	const builder = new Builder(specs.prisma, new Parser());

	for (const fixture of fixturesIterator(fixtures)) {
		try {
			await builder.build(fixture);
		} catch (error) {
			console.log(error);
		}
	}

	if (specs.doCloseDatabase) {
		await specs.prisma.$disconnect();
	}

	return specs.prisma;
}

// Prisma Utils

const exec = util.promisify(execNoPromise);

const prismaBinary = path.join(__dirname, '..', 'node_modules', '.bin', 'prisma');

export async function generate() {
	return exec(`${prismaBinary} generate`);
}

export async function pushDb() {
	return exec(`${prismaBinary} db push`);
}

export async function seedDb() {
	return exec(`${prismaBinary} db seed --preview-feature`);
}
