import { EntityManager, MikroORM, RequestContext } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import cors from 'cors';
import express, { Express } from 'express';
import type { Server } from 'socket.io';
import AbstractRouter from './AbstractRouter';

export type DefinedRouter = AbstractRouter | { new (): AbstractRouter };

export class RoutingManager {
	app: Express;
	database?: MikroORM;
	em?: EntityManager;

	routers: AbstractRouter[] = [];

	#io?: Server;

	constructor(app: Express) {
		this.app = app;
	}

	public createDefaultDatabase(): Promise<MikroORM> {
		return MikroORM.init(
			{
				metadataProvider: TsMorphMetadataProvider,
				entities: ['./dist/entities/**/*.js'],
				entitiesTs: ['./src/entities/**/*.ts'],
				tsNode: true,
				dbName: 'database',
				type: 'sqlite',
			},
			false,
		);
	}

	public async connectDatabase(connection?: MikroORM): Promise<MikroORM> {
		this.database = connection ?? (await this.createDefaultDatabase());

		this.em = this.database.em;

		this.routers.forEach((router) => {
			router.database = this.database;
			router.em = this.em;
		});

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

	manager.app.use((_req, _res, next) => {
		if (!manager.em) {
			throw `Entity manager not initialized yet, don't forget to connect to the database before letting requests flow in!`;
		}
		RequestContext.create(manager.em, next);
	});

	if (routers) {
		manager.registerRouter(routers);
	}

	return manager;
}

export default RoutingManager;
