import express, { Express } from 'express';
import { Connection, createConnection } from 'typeorm';
import AbstractRouter from './AbstractRouter';

export type DefinedRouter = AbstractRouter | { new (): AbstractRouter };

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

	public registerRouter(routers: DefinedRouter | DefinedRouter[]): void {
		if (Array.isArray(routers)) {
			routers.forEach(this.registerRouter.bind(this));
		} else {
			const definedRouter = routers instanceof AbstractRouter ? routers : new routers();

			const formattedPath = `${definedRouter.path.startsWith('/') ? '' : '/'}${definedRouter.path}`;

			this.app.use(formattedPath, definedRouter.routes.router);
		}
	}

	public async stop(): Promise<void> {
		return this.database?.close();
	}
}

export function createBasicRoutingManager(routers?: DefinedRouter | DefinedRouter[]): RoutingManager {
	const app = express();

	app.use(express.json());

	const manager = new RoutingManager(app);

	if (routers) {
		manager.registerRouter(routers);
	}

	return manager;
}

export default RoutingManager;
