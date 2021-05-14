import type { Config } from '@jest/types';
import fs from 'fs';
import JSON5 from 'json5';
import { pathsToModuleNameMapper } from 'ts-jest/utils';

const tsConfig = JSON5.parse(fs.readFileSync('./tsconfig.json', 'utf-8'));

const config: Config.InitialOptions = {
	testEnvironment: '<rootDir>/prisma/prisma.test-environment.js',
	moduleFileExtensions: ['js', 'json', 'ts'],
	// rootDir: 'src',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	testPathIgnorePatterns: ['<rootDir>/dist/'],
	collectCoverageFrom: ['**/*.ts', '!gulpfile.ts'],
	coverageDirectory: './coverage',
	coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/tests/', '<rootDir>/prisma/', '<rootDir>/dist/'],
	moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
};

export default config;
