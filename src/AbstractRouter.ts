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

	protected abstract init(router: Router): void;

	protected initSocket?(socket: Socket, io: Server): void;
}

export default AbstractRouter;
