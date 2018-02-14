
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Errback, NextFunction, Request, Response } from 'express';
import * as mongoose from 'mongoose';
import AuthController from './routes/AuthController';
import UserController from './routes/UserController';

const MONGODB_CON = 'mongodb://localhost:27017/prices';

export default class App {

	public static express: express.Express = App.init();

	/**
	 * Initializes app.
	 */
	private static init() {
		const app = express();
		App.linkDatabase(app);
		App.linkMiddleware(app);
		App.linkRoutes(app);

		return app;
	}

	/**
	 * Defines database.
	 *
	 * @param app
	 */
	private static linkDatabase(app: express.Express): void {
		mongoose.connect(MONGODB_CON);
		const db = mongoose.connection;
		db.on('error',
			console.error.bind(console, 'MongoDB connection error:')
		);
		db.once('open',
			() => { console.info('Connected to mongoose'); }
		);
	}

	/**
	 * Defines middleware.
	 *
	 * @param app
	 */
	private static linkMiddleware(app: express.Express): void {
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));
	}

	/**
	 * Defines routes.
	 *
	 * @param app
	 */
	private static linkRoutes(app: express.Express): void {

		app.get('/', (req: Request, res: Response) => {
			res.json({ status: 'operational' });
		});

		app.use('/', AuthController);
		app.use('/user', UserController);
	}
}
