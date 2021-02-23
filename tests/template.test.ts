import defaultRouters from '$/routers';
import { createBasicRoutingManager } from '$/RoutingManager';
import type { MikroORM } from '@mikro-orm/core';
import supertest from 'supertest';
import { loadFixtures } from './utils/fixtures';

let database: MikroORM | undefined = undefined;
let request: supertest.SuperTest<supertest.Test>;

beforeAll(async () => {
	const router = createBasicRoutingManager(defaultRouters);

	database = await router.connectDatabase(await loadFixtures(false));

	request = supertest(router.app);
});

afterAll(() => {
	return database?.close();
});

describe('Template test', () => {
	it('should pass the test', () => {
		expect(true).toEqual(true);
	});
});

describe('Testing messages endpoints', () => {
	it('should return all messages', async () => {
		const response = await request.get('/messages').expect('Content-Type', /json/).expect(200);

		expect(Array.isArray(response.body)).toBe(true);
		expect(response.body.length).toBe(3);
	});
});
