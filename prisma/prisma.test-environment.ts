import crypto from 'crypto';
import fs from 'fs/promises';
import NodeEnvironment from 'jest-environment-node';
import path from 'path';
import { configs } from '../gulpfile';
import { pushDb } from './functions';

export class PrismaTestEnvironment extends NodeEnvironment {
	dbName?: string;

	async setup() {
		const id = crypto.randomBytes(16).toString('hex');

		// Generate a unique sqlite identifier for this test context
		this.dbName = `test_${id}.db`;

		const prismaDbUrl = path.join(configs.tmpFolder, this.dbName);

		const dbUrl = `file:./${prismaDbUrl}`;

		process.env.DATABASE_URL = dbUrl;
		this.global.process.env.DATABASE_URL = dbUrl;

		const seedName = 'test';

		process.env.SEED = seedName;
		this.global.process.env.SEED = seedName;

		// Run the migrations to ensure our schema has the required structure
		await pushDb({ skipGenerators: true });

		return super.setup();
	}

	async teardown() {
		const dbPath = path.join(configs.tmpFullFolderPath, this.dbName!);

		try {
			await fs.unlink(dbPath);
		} catch (error) {
			// doesn't matter as the environment is torn down
		}
	}
}

export default PrismaTestEnvironment;
