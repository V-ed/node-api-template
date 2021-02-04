require('dotenv').config({ path: '.env.test' });

const fs = require('fs');
const JSON5 = require('json5');
const tsConfig = JSON5.parse(fs.readFileSync('./tsconfig.json', 'utf-8'));

const { pathsToModuleNameMapper } = require('ts-jest/utils');

module.exports = {
	preset: 'ts-jest',
	roots: ['tests'],
	testEnvironment: 'node',
	coverageReporters: ['json-summary', 'text', 'lcov'],
	coveragePathIgnorePatterns: ['<rootDir>/tests/', '<rootDir>/node_modules/'],
	moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
};
