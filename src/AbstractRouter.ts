import { Router } from 'express';
import type { Server, Socket } from 'socket.io';

export abstract class AbstractRouter {
	public router: Router;

	#io?: Server;
	get io(): Server | undefined {
		return this.#io;
	}
	set io(io: Server | undefined) {
		this.#io?.close();
		this.#io = io;
		this.#io?.on('connection', (socket: Socket) => this.initSocket?.(socket, this.#io!));
	}

	constructor() {
		this.router = Router();

		this.init(this.router);
	}

	/**
	 * This defines the root path of this router.
	 */
	public abstract path: string;

	/**
	 * Inits the Express Router under the `path` value.
	 *
	 * @param router Alias to `this.router`.
	 */
	protected abstract init(router: Router): void;

	/**
	 * Function that initialize every single socket that connects to this application.
	 * The `path` value is not used here, so any event that this function initializes is done so globally.
	 *
	 * @param socket The `Socket.IO`'s user socket. This socket includes the connected user's data and is expected to deal with handling real time interactions.
	 * @param io The `Socket.IO`'s io server containing all sockets and function that can emit data to connected users.
	 */
	protected initSocket?(socket: Socket, io: Server): void;
}

export default AbstractRouter;
