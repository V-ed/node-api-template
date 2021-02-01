import express, { Express } from 'express';
import * as http from 'http';
import { createConnection } from 'typeorm';
// import { AbstractApiRouter } from './AbstractApiRouter';
// import { AbstractRouter } from './AbstractRouter';
// import { checkCookiesAuth } from './middlewares/checkCookiesAuth';
// import { CategoryRouter } from './routes/CategoryRouter';
// import { CourseRouter } from './routes/CourseRouter';
// import { HomeworkRouter } from './routes/HomeworkRouter';
// import { IndexRouter } from './routes/IndexRouter';
// import { LoginRouter } from './routes/LoginRouter';
// import { QuestionRouter } from './routes/QuestionRouter';
// import { QuizRouter } from './routes/QuizRouter';

const app = express();

app.use(express.json());

export class Server {
	port: number | string;
	app: Express;
	server: http.Server | undefined;

	constructor(port: number | string, app: Express) {
		const normalizedPort = this.normalizePort(port);

		if (typeof normalizedPort === 'string' || typeof normalizedPort === 'number') {
			this.port = normalizedPort;
		} else {
			throw 'Invalid port given!';
		}

		this.app = app;
		this.server = undefined;
	}

	public async start(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.server = this.app.listen(this.port, async () => {
				await createConnection();

				// const runtimeDir = __dirname.endsWith('src') ? __dirname.substr(0, __dirname.length - 4) : __dirname;

				// this.app.use(express.static(`${runtimeDir}/public`)); // https://expressjs.com/en/starter/static-files.html

				// this.setupRouters(this.app, [IndexRouter, LoginRouter, CourseRouter, CategoryRouter, QuestionRouter, QuizRouter, HomeworkRouter]);

				// this.app.set('view engine', 'pug');

				console.log(`Server launched on port ${this.port}!`);

				resolve();
			});

			this.server.on('error', (e) => reject(this.onError(e, this.port)));
		});
	}

	// public setupRouters(initialRouter: Express, routerClasses: { new (): AbstractRouter }[]) {
	// 	initialRouter.use(cookieParser(), checkCookiesAuth);

	// 	const apiRoutes = Router();

	// 	routerClasses.forEach((routerClass) => {
	// 		const router: AbstractRouter = new routerClass();

	// 		const routerRootPath = router.getRootPath();

	// 		if (routerRootPath) {
	// 			initialRouter.use(routerRootPath, router.router);
	// 		}

	// 		if (router instanceof AbstractApiRouter) {
	// 			const apiRouter = router as AbstractApiRouter;

	// 			const apiRouterRootPath = apiRouter.getApiRootPath();

	// 			if (apiRouterRootPath) {
	// 				apiRoutes.use(apiRouterRootPath, apiRouter.apiRouter);
	// 			}
	// 		}
	// 	});

	// 	initialRouter.use(
	// 		'/api',
	// 		(req, _res, next) => {
	// 			req.isApi = true;
	// 			next();
	// 		},
	// 		apiRoutes,
	// 	);

	// 	initialRouter.use((_req, res) => {
	// 		return res.status(404).render('error', {
	// 			error: 'Ce lien ne mène nul part, veuillez réessayer!',
	// 		});
	// 	});
	// }

	public close(): http.Server | undefined {
		return this.server?.close();
	}

	private normalizePort(val: number | string): number | string | boolean {
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

export default new Server(process.env.PORT || '3000', app);
