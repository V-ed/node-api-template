import { Router } from 'express';
import type { Server, Socket } from 'socket.io';

export class ExpressSocketTranslator {
	public router: Router;

	private onNewClient?: (socket: Socket, io: Server) => void;

	#io?: Server;
	get io(): Server | undefined {
		return this.#io;
	}
	set io(io: Server | undefined) {
		this.#io?.close();
		this.#io = io;
		this.#io?.on('connection', (socket: Socket) => this.onNewClient?.(socket, this.#io!));
	}

	constructor(router: Router, io?: Server) {
		this.router = router;
		this.io = io;
	}

	public defineClientHandling(onNewClient: (socket: Socket, io: Server) => void): void {
		this.onNewClient = onNewClient;
	}
}

export abstract class AbstractRouter {
	public routes: ExpressSocketTranslator;
	abstract get path(): string;

	constructor() {
		this.routes = new ExpressSocketTranslator(Router());

		this.init(this.routes);
	}

	abstract init(routes: ExpressSocketTranslator): void;
}

export default AbstractRouter;
