import { AppModule } from '$/app.module';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import { seedTests } from '../prisma/seed';

beforeAll(async () => {
	await seedTests();
});

describe('MessageController (e2e)', () => {
	let app: INestApplication;
	let apolloClient: ApolloServerTestClient;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		const module = moduleFixture.get(GraphQLModule);

		apolloClient = createTestClient(module.apolloServer);
	});

	afterAll(async () => {
		await app.close();
	});

	it('/ (GET)', async () => {
		const result = await apolloClient.query({
			query: gql`
				query {
					messages {
						text
						time
					}
				}
			`,
			// variables: {},
		});

		expect(result.data).toBeDefined();

		expect(Array.isArray(result.data.messages)).toBe(true);
		expect(result.data.messages.length).toBe(3);

		result.data.messages.forEach((message: any) => {
			expect(message).toEqual({
				text: expect.any(String),
				time: expect.any(String),
			});
		});
	});
});
