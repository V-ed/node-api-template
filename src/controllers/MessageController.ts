import { prisma } from '$/database';
import type { Message, User } from '@prisma/client';

export type MessageUserType = Message & {
	user: User;
};

export class MessageController {
	static async createMessage(data: { username: string; message: string }): Promise<MessageUserType> {
		const newMessage = await prisma.message.create({
			data: {
				user: {
					connectOrCreate: {
						where: { username: data.username },
						create: {
							username: data.username,
							firstName: 'Jon',
							lastName: 'banana',
						},
					},
				},
				message: data.message,
			},
			include: { user: true },
		});

		return newMessage;
	}
}
