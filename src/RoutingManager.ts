import cors from 'cors';
import express, { Express } from 'express';
import type { Server } from 'socket.io';
import { Connection, createConnection } from 'typeorm';
import AbstractRouter from './AbstractRouter';

export type DefinedRouter = AbstractRouter | { new (): AbstractRouter };

export class RoutingManager {
	app: Express;
	database?: Connection;

	routers: AbstractRouter[] = [];

	#io?: Server;

	constructor(app: Express) {
		this.app = app;
	}

	public async connectDatabase(connection?: Connection): Promise<Connection> {
		this.database = connection ?? (await createConnection());

		return this.database;
	}

	public registerRouter(routers: DefinedRouter | DefinedRouter[]): void {
		if (Array.isArray(routers)) {
			routers.forEach(this.registerRouter.bind(this));
		} else {
			const definedRouter = routers instanceof AbstractRouter ? routers : new routers();

			const formattedPath = `${definedRouter.path.startsWith('/') ? '' : '/'}${definedRouter.path}`;

			definedRouter.io = this.#io;
			this.routers.push(definedRouter);

			this.app.use(formattedPath, definedRouter.router);
		}
	}

	public setIO(io: Server): this {
		this.routers.forEach((router) => (router.io = io));

		this.#io = io;

		return this;
	}

	public async stop(): Promise<void> {
		return this.database?.close();
	}
}

export function createBasicRoutingManager(routers?: DefinedRouter | DefinedRouter[]): RoutingManager {
	const app = express();

	app.use(cors({ origin: true }));
	app.options('*', cors);
	app.use(express.json());

	const manager = new RoutingManager(app);

	if (routers) {
		manager.registerRouter(routers);
	}

	return manager;
}

export default RoutingManager;
