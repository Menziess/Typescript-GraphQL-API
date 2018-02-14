
import * as bcrypt from 'bcryptjs';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { Errback, NextFunction, Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import { config } from '../config/config';
import { verifyToken } from '../middleware/VerifyToken';
import User from '../model/User';

const HOURS_24 = 86400;
const SERVER_ERROR = "Server error";
const USER_NOT_FOUND = "No user found";
const PROBLEM_REGISTERING_USER = "Problem registering user";

export class AuthController {

	router: Router;

	constructor() {
		this.router = Router();
		this.init();
	}

	init() {
		this.router.post('/register', this.postRegister);
		this.router.post('/login', this.postLogin);
		this.router.get('/logout', this.getLogout);
		this.router.get('/me', this.getMe);
	}

	/**
	 * Route for registering new users.
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public postRegister(req: Request, res: Response, next: NextFunction) {

		const hashedPassword = bcrypt.hashSync(req.body.password, 8);

		User.create({
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword
		}, (err: Errback, user: any) => {

			if (err) return res.status(500).send(PROBLEM_REGISTERING_USER);

			const cert = fs.readFileSync(
				path.join(__dirname, '../..', 'src/config/secret.pub'), 'utf8');

			const token = jwt.sign({ id: user._id }, cert, {
				expiresIn: HOURS_24
			});

			res.status(200).send({ auth: true, token: token });
		});
	}

	/**
	 * Login route.
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public postLogin(req: Request, res: Response, next: NextFunction) {

		User.findOne({ email: req.body.email }, (err: Errback, user: any) => {
			if (err) return res.status(500).send(SERVER_ERROR);
			if (!user) return res.status(404).send(USER_NOT_FOUND);

			const passwordIsValid = bcrypt.compareSync(
				req.body.password,
				user.password
			);

			if (!passwordIsValid)
				return res.status(401).send({ auth: false, token: null });

			const cert = fs.readFileSync(
				path.join(__dirname, '../..', 'src/config/secret.pub'), 'utf8');

			const token = jwt.sign({ id: user._id }, cert, {
				expiresIn: HOURS_24
			});

			res.status(200).send({ auth: true, token: token });
		});
	}

	/**
	 * Logout route.
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public getLogout(req: Request, res: Response, next: NextFunction) {
		res.status(200).send({ auth: false, token: null });
	}

	/**
	 * Get authenticated user.
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public getMe(req: Request, res: Response, next: NextFunction) {
		const userId = req.body.userId;

		User.findById(userId, { password: 0 }, (err, user) => {
			if (err) return res.status(500).send(USER_NOT_FOUND);
			if (!user) return res.status(404).send(USER_NOT_FOUND);
			res.status(200).send(user);
		});
	}
}

const controller = new AuthController();
controller.init();
const router = controller.router;

export default router;
