
import { Errback, NextFunction, Request, Response, Router } from 'express';
import { verifyToken } from '../middleware/VerifyToken';
import User from '../model/User';

export class UserController {

	router: Router;

	constructor() {
		this.router = Router();
		this.init();
		console.info(Object.getOwnPropertyNames(UserController));
	}

	init() {
		this.router.post('/', verifyToken, this.postCreate);
		this.router.get('/', verifyToken, this.getAll);
		this.router.get('/:id', verifyToken, this.getUserById);
		this.router.delete('/:id', verifyToken, this.deleteUserById);
		this.router.put('/:id', verifyToken, this.updateUserById);
	}

	private postCreate(req: Request, res: Response, next: NextFunction) {
		User.create({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password
		}, (err: Errback, user: any) => {
			if (err)
				return res.status(500)
					.send("There was a problem adding the information to the database.");

			res.status(200).send(user);
		});
	}

	private getAll(req: Request, res: Response, next: NextFunction) {
		User.find({}, (err, users) => {
			if (err) return res.status(500).send("There was a problem finding any users.");
			res.status(200).send(users);
		});
	}

	private getUserById(req: Request, res: Response, next: NextFunction) {
		User.findById(req.params.id, (err: Errback, user: any) => {
			if (err)
				return res.status(500)
					.send("There was a problem finding the user.");

			if (!user)
				return res.status(404)
					.send("No user found.");

			res.status(200).send(user);
		});
	}

	private deleteUserById(req: Request, res: Response, next: NextFunction) {
		User.findByIdAndRemove(req.params.id, (err: Errback, user: any) => {
			if (err)
				return res.status(500)
					.send("There was a problem deleting the user.");

			res.status(200).send("User: " + user.name + " was deleted.");
		});
	}

	private updateUserById(req: Request, res: Response, next: NextFunction) {
		User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
			if (err)
				return res.status(500)
					.send("There was a problem updating the user.");

			res.status(200).send(user);
		});
	}
}

const controller = new UserController();
controller.init();
const router = controller.router;

export default router;
