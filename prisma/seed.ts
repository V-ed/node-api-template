import { PrismaClient } from '@prisma/client';
import { ImportFixtureOptions, importFixtures } from 'prisma-fixtures';

export function seed(options?: Partial<ImportFixtureOptions>) {
	return importFixtures({
		...{
			prisma: options?.prisma ?? new PrismaClient(),
		},
		...options,
	});
}

export function seedTests(options?: Partial<ImportFixtureOptions>) {
	const testArgs: Partial<ImportFixtureOptions> = {
		...{
			fixturesPath: './tests/fixtures',
		},
		...options,
	};

	return seed(testArgs);
}

export default seed;
