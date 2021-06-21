import { exec as execNoPromise } from 'child_process';
import path from 'path';
import util from 'util';

// Prisma Utils

const exec = util.promisify(execNoPromise);

const prismaBinary = path.join(__dirname, '..', 'node_modules', '.bin', 'prisma');

export async function generate() {
	return exec(`${prismaBinary} generate`);
}

export type PushDbOptions = {
	skipGenerators: boolean;
};

export async function pushDb(options?: Partial<PushDbOptions>) {
	const opts: PushDbOptions = { ...{ skipGenerators: false }, ...(options ?? {}) };

	const optionsString = opts.skipGenerators ? ' --skip-generate' : '';

	return exec(`${prismaBinary} db push${optionsString}`);
}

export async function seedDb() {
	return exec(`${prismaBinary} db seed --preview-feature`);
}
