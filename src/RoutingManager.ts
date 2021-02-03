import express, { Express, Router } from 'express';
import { Connection, createConnection } from 'typeorm';

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

	public registerRouter(router: Router): void;
	public registerRouter(routers: Router[]): void;

	public registerRouter(routers: Router | Router[]): void {
		if (Array.isArray(routers)) {
			routers.forEach(this.registerRouter);
		} else {
			this.app.use(routers);
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
