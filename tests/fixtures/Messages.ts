import { Message, PrismaClient } from '@prisma/client';
import f from 'faker';
import { createRange, Fixture, LinkMethod, LinkMode } from 'prisma-fixtures';
import UserFixture from './Users';

export default class MessageFixture extends Fixture<Message> {
	override dependencies = [UserFixture];

	override async seed(prisma: PrismaClient, link: LinkMethod<this>): Promise<Message[]> {
		f.seed(123456789);

		const messages = await createRange(prisma.message.create, 3, () => ({
			text: f.random.words(4),
			userId: link(UserFixture, LinkMode.RANDOM).id,
		}));

		return messages;
	}
}
