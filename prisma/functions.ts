import { exec as execNoPromise } from 'child_process';
import path from 'path';
import util from 'util';

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
