
import { Errback, NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import { isArray, isString } from 'util';
import { config } from '../config/config';

export function verifyToken(req: Request, res: Response, next: NextFunction) {

	// check header or url parameters or post parameters for token
	let token = req.headers['x-access-token'];
	if (isArray(token))
		token = token[0];

	if (!token)
		return res.status(403)
			.send({ auth: false, message: 'No token provided.' });

	const cert = fs.readFileSync(
		path.join(__dirname, '../..', 'src/config/secret.pub'), 'utf8');

	// verifies secret and checks exp
	jwt.verify(token, cert, (err: any, decoded: any) => {
		if (err)
			return res.status(500)
				.send({ auth: false, message: 'Failed authenticating token.' });

		req.body.userId = decoded.id;
		next();
	});

}
