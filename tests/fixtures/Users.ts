import { PrismaClient, User } from '@prisma/client';
import f from 'faker';
import { createRange, Fixture } from 'prisma-fixtures';

export default class UserFixture extends Fixture<User> {
	override dependencies = [];

	override async seed(prisma: PrismaClient): Promise<User[]> {
		f.seed(123456789);

		const users = await createRange(prisma.user.create, 5, () => ({
			username: f.unique(f.internet.userName),
			firstName: f.name.firstName(),
			lastName: f.name.lastName(),
		}));

		return users;
	}
}
