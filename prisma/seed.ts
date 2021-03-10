import { PrismaClient } from '@prisma/client';
import { importFixtures } from './seeder';

export async function main(prisma: PrismaClient): Promise<PrismaClient> {
	return importFixtures(prisma);
}

export async function test(prisma: PrismaClient): Promise<PrismaClient> {
	return importFixtures(prisma, './tests/fixtures');
}

if (require.main === module) {
	const prisma = new PrismaClient();

	const mainMap: Record<string, (prisma: PrismaClient) => Promise<unknown>> = {
		main,
		test,
	};

	const mainFunc = mainMap[process.env.SEED as string] ?? mainMap.main;

	console.log(`>>> Using seed func [${mainFunc.name}]`);

	mainFunc(prisma)
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(async () => {
			await prisma.$disconnect();
		});
}
