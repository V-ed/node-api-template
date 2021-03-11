// const dotenv = require('dotenv');
const fs = require('fs');
const JSON5 = require('json5');
const { pathsToModuleNameMapper } = require('ts-jest/utils');

// dotenv.config({ path: '.env.test' });

const tsConfig = JSON5.parse(fs.readFileSync('./tsconfig.json', 'utf-8'));

module.exports = {
	testTimeout: 30000,
	testEnvironment: '<rootDir>/../prisma/prisma.test-environment.js',
	moduleFileExtensions: ['js', 'json', 'ts'],
	// rootDir: 'src',
	testRegex: '\\.e2e-spec\\.ts$',
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.ts', '!gulpfile.ts'],
	coverageDirectory: '../coverage',
	coveragePathIgnorePatterns: ['<rootDir>/fixtures/'],
	moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: '<rootDir>/..' }),
};
