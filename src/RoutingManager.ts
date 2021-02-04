import express, { Express } from 'express';
import { Connection, createConnection } from 'typeorm';
import type AbstractRouter from './AbstractRouter';

export class RoutingManager {
	app: Express;
	database?: Connection;

	constructor(app: Express) {
		this.app = app;
	}

	public async connectDatabase(): Promise<Connection> {
		this.database = await createConnection();

		return this.database;
	}

	public registerRouter(router: AbstractRouter): void;
	public registerRouter(routers: AbstractRouter[]): void;

	public registerRouter(routers: AbstractRouter | AbstractRouter[]): void {
		if (Array.isArray(routers)) {
			routers.forEach(this.registerRouter);
		} else {
			const formattedPath = `${routers.path.startsWith('/') ? '' : '/'}${routers.path}`;

			this.app.use(formattedPath, routers.routes.router);
		}
	}

	public async stop(): Promise<void> {
		return this.database?.close();
	}
}

export function createBasicRoutingManager(): RoutingManager {
	const app = express();

	app.use(express.json());

	const manager = new RoutingManager(app);

	return manager;
}

export default RoutingManager;
