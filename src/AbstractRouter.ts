import type { EntityManager, MikroORM } from '@mikro-orm/core';
import { Router } from 'express';
import type { Server, Socket } from 'socket.io';

export abstract class AbstractRouter {
	public router: Router;
	public database?: MikroORM;
	public em?: EntityManager;

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

	initSocket?(socket: Socket, io: Server): void;
}

export default AbstractRouter;
