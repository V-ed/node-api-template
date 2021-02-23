import AbstractRouter from '$/AbstractRouter';
import { Message } from '$orm/Message';
import type { Server, Socket } from 'socket.io';

type SendMessageTypeIO = {
	username: string;
	message: string;
};

export class MessageRouter extends AbstractRouter {
	get path(): string {
		return 'messages';
	}

	init(): void {
		this.router.get('/', async (_req, res) => {
			const messages = await this.em?.find(Message, {});

			res.json(messages);
		});
	}

	initSocket(socket: Socket, io: Server): void {
		socket.on('send_message', async ({ username, message }: SendMessageTypeIO) => {
			const messageEnt = new Message();

			messageEnt.username = username;
			messageEnt.message = message;

			await this.em?.persistAndFlush(messageEnt);

			console.log(messageEnt);

			io.emit('send_message', { username, message });
		});
	}
}

export default MessageRouter;
