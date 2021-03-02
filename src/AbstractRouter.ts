import { Router } from 'express';
import type { IncomingMessage } from 'http';
import type WebSocket from 'ws';

export abstract class AbstractRouter {
	public router: Router;

	#wss!: WebSocket.Server;
	get wss(): WebSocket.Server {
		return this.#wss;
	}
	set wss(io: WebSocket.Server) {
		this.#wss?.close();
		this.#wss = io;
		this.#wss?.on('connection', (socket: WebSocket, request: IncomingMessage) => this.initSocket?.(socket, request));
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
	 * @param socket The user web socket. This socket includes the connected user's data and is expected to deal with handling real time interactions.
	 * @param request The incoming message made based from the WebSocket.
	 */
	protected initSocket?(socket: WebSocket, request: IncomingMessage): void;
}

export default AbstractRouter;
