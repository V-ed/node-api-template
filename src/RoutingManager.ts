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

	/**
	 * Automatically registers all routers that extends `AbstractRouter` under a folder, recursively.
	 *
	 * @param routersFolderPath The folder path that will get resolved by `path.resolve`. Defaults to `./src/routers`.
	 */
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

	/**
	 * Register given routers into the application.
	 *
	 * @param routers The routers to register and initialize.
	 */
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

	/**
	 * Stops the `Socket.IO`'s server.
	 */
	public async stop(): Promise<void> {
		return this.#io?.close();
	}
}

/**
 * Creates a basic routing manager, with a default Express configuration that allows CORS and accepts JSON data.
 *
 * The routers are also automatically registered using the given `routersFolderPath`'s path.
 *
 * @param routersFolderPath The folder path containing one or more `AbstractRouter`s, recursively.
 */
export function createBasicRoutingManager(routersFolderPath?: string): RoutingManager;
/**
 * Creates a basic routing manager, with a default Express configuration that allows CORS and accepts JSON data.
 *
 * @param routers The routers to register by default when creating the basic RoutingManager.
 */
export function createBasicRoutingManager(routers?: DefinedRouter[]): RoutingManager;
/**
 * Creates a basic routing manager, with a default Express configuration that allows CORS and accepts JSON data.
 *
 * If the given `autoRegisterRouters` is `true`, the routers are also automatically registered using the method `RoutingManager.autoRegisterRouters()`, with the default path.
 *
 * @param doDiscoverRoutersAutomatically Boolean that determines if the routers are automatically discovered or not.
 */
export function createBasicRoutingManager(autoRegisterRouters: boolean): RoutingManager;

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
