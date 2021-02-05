import AbstractRouter, { ExpressSocketTranslator } from '$/AbstractRouter';
import Message from '$orm/Message';

type SendMessageTypeIO = {
	username: string;
	message: string;
};

export class MessageRouter extends AbstractRouter {
	get path(): string {
		return 'messages';
	}

	init(routing: ExpressSocketTranslator): void {
		routing.router.get('/', async (_req, res) => {
			const messages = await Message.find();

			res.json(messages);
		});

		routing.defineClientHandling((socket, io) => {
			socket.on('send_message', async ({ username, message }: SendMessageTypeIO) => {
				const messageEnt = new Message();

				messageEnt.username = username;
				messageEnt.message = message;

				await messageEnt.save();

				console.log(messageEnt);

				io.emit('send_message', { username, message });
			});
		});
	}
}

export default MessageRouter;
