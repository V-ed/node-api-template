import AbstractRouter from '$/AbstractRouter';
import { MessageController } from '$/controllers/MessageController';
import { prisma } from '$/database';
import type WebSocket from 'ws';

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

		this.router.post('/', async (req, res) => {
			const { username, message } = req.body;

			const newMessage = await MessageController.createMessage({ username, message });

			res.json({ user: newMessage.user, message: newMessage.message });
		});
	}

	initSocket(socket: WebSocket): void {
		socket.on('send_message', async (data: SendMessageTypeIO) => {
			const newMessage = await MessageController.createMessage(data);

			this.wss.emit('send_message', { user: newMessage.user, message: newMessage.message });
		});
	}
}

export default MessageRouter;
