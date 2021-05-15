import { PrismaService } from '$/prisma.service';
import { SocketService } from '$/socket/socket.service';
import { Injectable } from '@nestjs/common';
import type { CreateMessageDto } from './dto/create-message.dto';
import type { IUserMessage } from './interfaces/message.interface';

@Injectable()
export class MessageService {
	constructor(private readonly prisma: PrismaService, private readonly socket: SocketService) {}

	async createMessage(messageData: CreateMessageDto): Promise<IUserMessage> {
		const { username, text } = messageData;

		const newMessage = await this.prisma.message.create({
			data: {
				text,
				user: {
					connectOrCreate: {
						where: { username },
						create: {
							username,
							firstName: 'Jon',
							lastName: 'banana',
						},
					},
				},
			},
			include: { user: true },
		});

		const sendableMessage = { user: newMessage.user, message: newMessage.text };

		this.socket.server.emit('send_message', sendableMessage);

		return sendableMessage;
	}
}
