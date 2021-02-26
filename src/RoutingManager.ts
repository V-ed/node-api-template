import cors from 'cors';
import express, { Express } from 'express';
import type { Server } from 'socket.io';
import AbstractRouter from './AbstractRouter';

export type DefinedRouter = AbstractRouter | { new (): AbstractRouter };

export class RoutingManager {
	app: Express;
	routers: AbstractRouter[] = [];
	#io?: Server;

	constructor(app: Express) {
		this.app = app;
	}

	public registerRouters(...routers: DefinedRouter[]): void {
		routers.forEach((router) => {
			const definedRouter = router instanceof AbstractRouter ? router : new router();

			const formattedPath = `${definedRouter.path.startsWith('/') ? '' : '/'}${definedRouter.path}`;

			definedRouter.io = this.#io;
			this.routers.push(definedRouter);

			this.app.use(formattedPath, definedRouter.router);
		});
	}

	public setIO(io: Server): this {
		this.routers.forEach((router) => (router.io = io));

		this.#io = io;

		return this;
	}

	public async stop(): Promise<void> {
		return this.#io?.close();
	}
}

export function createBasicRoutingManager(...routers: DefinedRouter[]): RoutingManager {
	const app = express();

	app.use(cors({ origin: true }));
	app.options('*', cors);
	app.use(express.json());

	const manager = new RoutingManager(app);

	if (routers) {
		manager.registerRouters(...routers);
	}

	return manager;
}

export default RoutingManager;
