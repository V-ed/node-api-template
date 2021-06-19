import { Message, PrismaClient } from '@prisma/client';
import { Fixture, LinkMethod } from '../fixtures-loader/fixture';
import { createMany } from '../fixtures-loader/utils';
import UserFixture from './Users';

export default class MessageFixture extends Fixture<Message> {
	override dependencies = [UserFixture];

	override async seed(prisma: PrismaClient, link: LinkMethod<this>): Promise<Message[]> {
		const messages = await createMany(
			prisma.message.create,
			{
				text: 'Test1',
				user: {
					connect: {
						username: 'V-ed',
					},
				},
			},
			(index) => ({
				text: 'Hello!',
				userId: link(UserFixture, index).id,
			}),
		);

		return messages;
	}
}
