import { PrismaClient } from '@prisma/client';
import { importFixtures } from './seeder';

const prisma = new PrismaClient();

importFixtures(prisma)
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
