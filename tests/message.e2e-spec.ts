import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { seedTests } from '../prisma/seed';
import { AppModule } from '../src/app.module';

beforeAll(async () => {
	await seedTests();
});

describe('MessageController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	it('/ (GET)', async () => {
		const response = await request(app.getHttpServer()).get('/messages').expect('Content-Type', /json/).expect(200);

		expect(Array.isArray(response.body)).toBe(true);
		expect(response.body.length).toBe(3);
	});
});
