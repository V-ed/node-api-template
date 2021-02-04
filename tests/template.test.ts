import defaultRouters from '$/routers';
import { createBasicRoutingManager } from '$/RoutingManager';
import supertest from 'supertest';
import { loadFixtures } from './utils/fixtures';

let request: supertest.SuperTest<supertest.Test>;

beforeAll(async () => {
	await loadFixtures();

	const router = createBasicRoutingManager(defaultRouters);

	await router.connectDatabase();

	request = supertest(router.app);
});

describe('Template test', () => {
	it('should pass the test', () => {
		expect(true).toEqual(true);
	});
});

describe('Testing messages endpoints', () => {
	it('should return all messages', async (done) => {
		request.get('/messages').expect('Content-Type', /json/).expect(200, done);
	});
});
