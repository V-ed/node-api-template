import type * as http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { createBasicRoutingManager, RoutingManager } from './RoutingManager';

export const DEFAULT_PORT = 3000;

export class Server {
	manager: RoutingManager;
	port: number;
	server?: http.Server;
	io?: SocketIOServer;

	constructor(manager: RoutingManager, port: number | string | undefined = process.env.node) {
		const normalizedPort = this.normalizePort(port);

		if (typeof normalizedPort == 'number') {
			this.port = normalizedPort;
		} else {
			throw normalizedPort ? ` '${normalizedPort}' is not a valid port!` : 'Invalid port given!';
		}

		this.manager = manager;
		this.server = undefined;
	}

	public async start(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.server = this.manager.app.listen(this.port, async () => {
				console.log(`Server launched on port ${this.port}!`);
			});

			this.server.on('close', resolve);
			this.server.on('error', (e) => reject(this.onError(e, this.port)));

			this.io = new SocketIOServer(this.server, {
				cors: {
					origin: '*',
				},
			});
			this.manager.setIO(this.io);
		});
	}

	public async close(): Promise<http.Server | undefined> {
		await this.manager.stop();
		return this.server?.close();
	}

	private normalizePort(val?: number | string): number | string | false {
		if (!val) {
			return DEFAULT_PORT;
		}

		const port: number = typeof val === 'string' ? parseInt(val, 10) : val;

		if (isNaN(port)) {
			return val;
		} else if (port >= 0) {
			return port;
		} else {
			return false;
		}
	}

	private onError(error: NodeJS.ErrnoException, port: unknown): string | NodeJS.ErrnoException {
		if (error.syscall !== 'listen') {
			throw error;
		}

		const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

		switch (error.code) {
			case 'EACCES':
				return `${bind} requires elevated privileges`;
			case 'EADDRINUSE':
				return `${bind} is already in use`;
			default:
				throw error;
		}
	}
}

export default new Server(createBasicRoutingManager(), process.env.PORT);
