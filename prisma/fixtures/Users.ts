import { PrismaClient, User } from '@prisma/client';
import { createMany, Fixture } from '../fixtures-loader';

export default class UserFixture extends Fixture<User> {
	override dependencies = [];

	override async seed(prisma: PrismaClient): Promise<User[]> {
		const users = await createMany(prisma.user.create, {
			username: 'V-ed',
			firstName: 'Guilaume',
			lastName: 'Marcoux',
		});

		return users;
	}
}
