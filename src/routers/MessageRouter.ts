import AbstractRouter from '$/AbstractRouter';
import { MessageController } from '$/controllers/MessageController';
import { prisma } from '$/database';
import { validate } from '$/validator';
import { messageChain } from '$/validators/MessageValidator';
import type { Server, Socket } from 'socket.io';

type SendMessageTypeIO = {
	username: string;
	message: string;
};

export class MessageRouter extends AbstractRouter {
	public path = 'messages';

	init(): void {
		this.router.get('/', async (_req, res) => {
			const messages = await prisma.message.findMany({ include: { user: true } });

			res.json(messages);
		});

		this.router.post('/', validate(messageChain), async (req, res) => {
			const { username, message } = req.body;

			const newMessage = await MessageController.createMessage({ username, message });

			const sendableMessage = { user: newMessage.user, message: newMessage.message };

			res.json(sendableMessage);

			this.io?.emit('send_message', sendableMessage);
		});
	}

	initSocket(socket: Socket, io: Server): void {
		socket.on('send_message', async (data: SendMessageTypeIO) => {
			const newMessage = await MessageController.createMessage(data);

			io.emit('send_message', { user: newMessage.user, message: newMessage.message });
		});
	}
}

export default MessageRouter;
