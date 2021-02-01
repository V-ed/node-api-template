/* eslint-disable */

require('dotenv').config({ path: '.env.test' });

module.exports = {
	preset: 'ts-jest',
	roots: ['tests'],
	testEnvironment: 'node',
	coverageReporters: ['json-summary', 'text', 'lcov'],
	moduleNameMapper: {
		'^src/(.*)$': '<rootDir>/src/$1',
	},
	coveragePathIgnorePatterns: ["<rootDir>/tests/", "<rootDir>/node_modules/"]
};
