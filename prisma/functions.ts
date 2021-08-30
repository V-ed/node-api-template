import { exec as execNoPromise } from 'child_process';
import path from 'path';
import util from 'util';
import { seedTests } from './seed';

// Prisma Utils

const exec = util.promisify(execNoPromise);

const prismaBinary = path.join(__dirname, '..', 'node_modules', '.bin', 'prisma');

export async function generate() {
	return exec(`${prismaBinary} generate`);
}

export type PushDbOptions = {
	skipGenerators: boolean;
	acceptDataLoss: boolean;
	forceReset: boolean;
};

export async function pushDb(options?: Partial<PushDbOptions>) {
	const opts: PushDbOptions = { ...{ skipGenerators: false, acceptDataLoss: false, forceReset: false }, ...(options ?? {}) };

	let optionsString = '';

	optionsString = `${optionsString}${opts.skipGenerators ? ' --skip-generate' : ''}`;
	optionsString = `${optionsString}${opts.acceptDataLoss ? ' --accept-data-loss' : ''}`;
	optionsString = `${optionsString}${opts.forceReset ? ' --force-reset' : ''}`;

	return exec(`${prismaBinary} db push${optionsString}`);
}

export async function seedDb() {
	return exec(`${prismaBinary} db seed --preview-feature`);
}

export async function prepareTestDb() {
	// Run the migrations to ensure our schema has the required structure
	await pushDb({ skipGenerators: true, acceptDataLoss: true, forceReset: true });

	return await seedTests();
}
