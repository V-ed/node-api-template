import { MikroORM } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { FixtureFactory } from '@mikro-resources/fixtures';

/**
 * Loads the fixtures from the `typeorm-fixtures-cli` package.
 *
 * @param fixturesPath The path to the fixtures folder. Defaults to `./fixtures`. `.` refer to project's root.
 *
 * Example paths :
 * - `${__dirname}/fixtures` - current directory's fixture folder
 */
export async function loadFixtures(doCloseDatabase = true, fixturesPath = './fixtures'): Promise<MikroORM> {
	const orm = await MikroORM.init({
		metadataProvider: TsMorphMetadataProvider,
		entities: ['./dist/entities/**/*.js'],
		entitiesTs: ['./src/entities/**/*.ts'],
		tsNode: true,
		dbName: 'test-database',
		type: 'sqlite',
	});

	const factory = new FixtureFactory(orm);

	return orm;
}
