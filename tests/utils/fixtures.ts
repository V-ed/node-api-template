import * as path from 'path';
import { Connection, createConnection, getRepository } from 'typeorm';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli/dist';

export async function loadFixtures(fixturesPath: string): Promise<void> {
	let connection: Connection | undefined;

	try {
		connection = await createConnection();
		await connection.synchronize(true);

		const loader = new Loader();

		loader.load(path.resolve(fixturesPath));

		const resolver = new Resolver();
		const fixtures = resolver.resolve(loader.fixtureConfigs);
		const builder = new Builder(connection, new Parser());

		for (const fixture of fixturesIterator(fixtures)) {
			const entity = await builder.build(fixture);
			const repo = getRepository(entity.constructor.name);

			repo.save(entity);
		}
	} finally {
		if (connection) {
			await connection.close();
		}
	}
}
