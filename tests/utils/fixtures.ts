import * as path from 'path';
import { createConnection, getRepository } from 'typeorm';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';

/**
 * Loads the fixtures from the `typeorm-fixtures-cli` package.
 *
 * @param fixturesPath The path to the fixtures folder. Defaults to `./fixtures`. `.` refer to preject's root.
 *
 * Example paths :
 * - `${__dirname}/fixtures` - current directory's fixture folder
 */
export async function loadFixtures(fixturesPath = './fixtures'): Promise<void> {
	const connection = await createConnection();

	await connection.synchronize(true);

	const loader = new Loader();

	loader.load(path.resolve(fixturesPath));

	const resolver = new Resolver();
	const fixtures = resolver.resolve(loader.fixtureConfigs);
	const builder = new Builder(connection, new Parser());
	
	const entitiesPromiseMap = [];
	
	for (const fixture of fixturesIterator(fixtures)) {
		const entity = await builder.build(fixture);
		const repo = getRepository(entity.constructor.name);

		entitiesPromiseMap.push(repo.save(entity));
	}
	
	await Promise.all(entitiesPromiseMap);
	
	await connection.close();
}
