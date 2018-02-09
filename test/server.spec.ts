
import * as request from 'supertest';
import * as app from '../src/server';
import { expect } from 'chai';

describe('v1-doc', () => {
	it('200 status code', (done) => {
		request(app).get('/v1-doc')
			.expect(200, done);
	})
})
