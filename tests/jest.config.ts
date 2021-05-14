import type { Config } from '@jest/types';
import fs from 'fs';
import JSON5 from 'json5';
import { pathsToModuleNameMapper } from 'ts-jest/utils';
import jestConfigs from '../jest.config';

const tsConfig = JSON5.parse(fs.readFileSync('./tsconfig.json', 'utf-8'));

const e2eConfigs: Config.InitialOptions = {
	...jestConfigs,
	testTimeout: 30000,
	testEnvironment: '<rootDir>/../prisma/prisma.test-environment.js',
	testRegex: '\\.e2e-spec\\.ts$',
	coverageDirectory: '../coverage',
	coveragePathIgnorePatterns: ['<rootDir>/fixtures/'],
	moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: '<rootDir>/..' }),
};

export default e2eConfigs;
