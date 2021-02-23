import { Router } from 'express';
import type { Server, Socket } from 'socket.io';

export interface AbstractRouter {
	initSocket?(socket: Socket, io: Server): void;
}

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

	abstract get path(): string;

	abstract init(router: Router): void;
}

export default AbstractRouter;