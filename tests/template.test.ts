import server from 'src/server';
import { loadFixtures } from './utils/fixtures';

// const root = `http://localhost:${process.env.PORT}`;

beforeAll(async () => {
	await loadFixtures();
	await server.start();
});

afterAll(async () => {
	await server.close();
});

describe('Template test', () => {
	it('should pass the test', () => {
		expect(true).toEqual(true);
	});
});

// describe('Testing login endpoints', () => {
// 	it('should return a valid jwt', async () => {
// 		const res = await axios.post(`${root}/api/login`, {
// 			username: 'Teacher1',
// 			password: 'teach',
// 		});

// 		expect(res.data.token).toEqual(expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/));
// 	});
// });
