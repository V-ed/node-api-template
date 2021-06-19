import { ImportFixtureOptions, loadFixtures } from './fixtures-loader';

export function seed(...args: Parameters<typeof loadFixtures>) {
	return loadFixtures(...args);
}

export function seedTests(...args: Parameters<typeof seed>) {
	const testArgs: Partial<ImportFixtureOptions> = {
		...{
			fixturesPath: './tests/fixtures',
		},
		...args[0],
	};

	return seed(testArgs);
}

export default seed;
