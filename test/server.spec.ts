
import { expect } from 'chai';
import * as request from 'supertest';
import { App } from '../src/server';

describe('Root url check', () => {
	it('200 on root page', done => {
		request(App.express).get('/')
			.expect(200, done);
	});
	it('404 everything else', function testPath(done) {
		request(App.express)
			.get('/foo/bar')
			.expect(404, done);
	});
});
