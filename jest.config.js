// const dotenv = require('dotenv');
const fs = require('fs');
const JSON5 = require('json5');
const path = require('path');
const { pathsToModuleNameMapper } = require('ts-jest/utils');

// dotenv.config({ path: '.env.test' });

const tsConfig = JSON5.parse(fs.readFileSync('./tsconfig.json', 'utf-8'));

module.exports = {
	testEnvironment: path.join(__dirname, 'prisma', 'prisma.test-environment.js'),
	moduleFileExtensions: ['json', 'ts'],
	// rootDir: 'src',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.ts'],
	coverageDirectory: '../coverage',
	coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/tests/', '<rootDir>/prisma/'],
	moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
};
