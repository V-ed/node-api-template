import AbstractRouter, { ExpressSocketTranslator } from '$/AbstractRouter';
import Message from '$orm/Message';

type SendMessageTypeIO = {
	username: string;
	message: string;
};

export class MessageRouter extends AbstractRouter {
	get path(): string {
		return '/';
	}

	init(routing: ExpressSocketTranslator): void {
		routing.router.get('/', (_req, res) => {
			res.send('Hello!');
		});

		routing.defineClientHandling((socket) => {
			socket.on('send_message', async ({ username, message }: SendMessageTypeIO) => {
				const messageEnt = new Message();

				messageEnt.username = username;
				messageEnt.message = message;

				await messageEnt.save();

				routing.io.emit('send_message', { username, message });
			});
		});
	}
}

export default MessageRouter;
