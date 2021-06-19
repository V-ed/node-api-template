import { Message, PrismaClient } from '@prisma/client';
import f from 'faker';
import { createMany, Fixture, LinkMethod, LinkMode } from '../../prisma/fixtures-loader';
import UserFixture from './Users';

export default class MessageFixture extends Fixture<Message> {
	override dependencies = [UserFixture];

	override async seed(prisma: PrismaClient, link: LinkMethod<this>): Promise<Message[]> {
		const messages = await createMany(
			prisma.message.create,
			{
				text: f.random.words(4),
				userId: link(UserFixture, LinkMode.RANDOM).id,
			},
			{
				text: f.random.words(4),
				userId: link(UserFixture, LinkMode.RANDOM).id,
			},
			{
				text: f.random.words(4),
				userId: link(UserFixture, LinkMode.RANDOM).id,
			},
		);

		return messages;
	}
}
