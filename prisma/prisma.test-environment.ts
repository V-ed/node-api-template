import fs from 'fs';
import NodeEnvironment from 'jest-environment-node';
import path from 'path';
import { pushDb } from './functions';

export class PrismaTestEnvironment extends NodeEnvironment {
	dbName?: string;
	dbPath?: string;

	async setup() {
		const randomNum = Math.round(Math.random() * 1000);

		// Generate a unique sqlite identifier for this test context
		this.dbName = `test_${Date.now()}_${randomNum}.db`;
		this.dbPath = path.join(__dirname, 'tmp', this.dbName);

		const dbUrl = `file:./tmp/${this.dbName}`;

		process.env.DATABASE_URL = dbUrl;
		this.global.process.env.DATABASE_URL = dbUrl;

		process.env.SEED = 'test';
		this.global.process.env.SEED = 'test';

		// Run the migrations to ensure our schema has the required structure
		await pushDb();

		return super.setup();
	}

	async teardown() {
		try {
			await fs.promises.unlink(this.dbPath!);
		} catch (error) {
			// doesn't matter as the environment is torn down
		}
	}
}

export default PrismaTestEnvironment;
