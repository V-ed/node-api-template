import { PrismaClient } from '@prisma/client';
import { importFixtures } from './functions';

export function seedPath(prisma?: PrismaClient, path?: string) {
	return importFixtures({ prisma, fixturesPath: path });
}

export function seed(prisma?: PrismaClient): Promise<PrismaClient> {
	return seedPath(prisma);
}

export function seedTests(prisma?: PrismaClient): Promise<PrismaClient> {
	return seedPath(prisma, './tests/fixtures');
}

export default seed;
