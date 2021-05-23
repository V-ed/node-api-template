import { PrismaClient } from '@prisma/client';
import { importFixtures } from './fixtures';

export function seedPath(prisma?: PrismaClient, path?: string) {
	return importFixtures(prisma, path);
}

export function seed(prisma?: PrismaClient): Promise<PrismaClient> {
	return seedPath(prisma);
}

export function seedTests(prisma?: PrismaClient): Promise<PrismaClient> {
	return seedPath(prisma, './tests/fixtures');
}

export default seed;
