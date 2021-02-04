import { Router } from 'express';
import { Server, Socket } from 'socket.io';

const io = new Server();

export class ExpressSocketTranslator {
	public router: Router;
	public io: Server;

	private onNewClient?: (socket: Socket) => void;

	constructor(router: Router, io: Server) {
		this.router = router;
		this.io = io;
		this.io.on('connection', (socket: Socket) => this.onNewClient?.(socket));
	}

	public defineClientHandling(onNewClient: (socket: Socket) => void): void {
		this.onNewClient = onNewClient;
	}
}

export abstract class AbstractRouter {
	public routes: ExpressSocketTranslator;
	abstract get path(): string;

	constructor() {
		this.routes = new ExpressSocketTranslator(Router(), io);

		this.init(this.routes);
	}

	abstract init(routes: ExpressSocketTranslator): void;
}

export default AbstractRouter;
