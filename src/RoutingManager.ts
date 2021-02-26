import cors from 'cors';
import express, { Express } from 'express';
import path from 'path';
import readdir from 'recursive-readdir';
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

	public async autoRegisterRouters(routersFolderPath = './src/routers'): Promise<void> {
		const fullDirPath = path.resolve(routersFolderPath);

		const filePaths = await readdir(fullDirPath, ['!*.+(ts|js)']);

		const defaultImports: unknown[] = await Promise.all(filePaths.map(async (filePath) => (await import(filePath)).default));

		const routers: AbstractRouter[] = defaultImports
			.filter((commandInstance) => {
				return typeof commandInstance == 'function' && commandInstance.prototype instanceof AbstractRouter;
			})
			.map((commandInstance) => commandInstance as AbstractRouter);

		return this.registerRouters(...routers);
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

export function createBasicRoutingManager(routersFolderPath?: string): RoutingManager;
export function createBasicRoutingManager(routers?: DefinedRouter[]): RoutingManager;
export function createBasicRoutingManager(doDiscoverRoutersAutomatically: boolean): RoutingManager;

export function createBasicRoutingManager(routersOrAuto?: boolean | string | DefinedRouter[]): RoutingManager {
	const app = express();

	app.use(cors({ origin: true }));
	app.options('*', cors);
	app.use(express.json());

	const manager = new RoutingManager(app);

	if (Array.isArray(routersOrAuto)) {
		manager.registerRouters(...routersOrAuto);
	} else if (routersOrAuto) {
		manager.autoRegisterRouters(typeof routersOrAuto == 'string' ? routersOrAuto : undefined);
	}

	return manager;
}

export default RoutingManager;
