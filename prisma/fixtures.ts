import { Builder, fixturesIterator, Loader, Parser, Resolver } from '@getbigger-io/prisma-fixtures-cli';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';

/**
 * Implementation of {@link https://github.com/getbigger-io/prisma-fixtures|getbigger-io/prisma-fixtures}'s programmatic loading of fixtures.
 *
 * @param prisma The prisma client on which to import the fixtures in. Uses the default prisma client if undefined.
 * @param fixturesPath The path to the fixtures folder. Defaults to `./fixtures`. `.` refer to project's root.
 *
 * Example paths :
 * - `${__dirname}/fixtures` - current directory's fixture folder
 * @param doCloseDatabase Close Prisma's database or not after importing all fixtures. Defaults to `true`.
 */
export async function importFixtures(prisma?: PrismaClient, fixturesPath = './fixtures', doCloseDatabase = true): Promise<PrismaClient> {
	if (!prisma) {
		prisma = new PrismaClient();
	}

	await prisma.$connect();

	const loader = new Loader();

	const resolvedPath = path.resolve(fixturesPath);

	loader.load(resolvedPath);

	const resolver = new Resolver();
	const fixtures = resolver.resolve(loader.fixtureConfigs);
	const builder = new Builder(prisma, new Parser());

	for (const fixture of fixturesIterator(fixtures)) {
		try {
			await builder.build(fixture);
		} catch (error) {
			console.log(error);
		}
	}

	if (doCloseDatabase) {
		await prisma.$disconnect();
	}

	return prisma;
}
