/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'node',
	extensionsToTreatAsEsm: ['.ts'],
	globals: {
		'ts-jest': {
			useESM: true,
			tsconfig: 'tsconfig.server.json',
		},
	},
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	testMatch: ['**/__tests__/**/*.test.(ts|js)'],
	moduleFileExtensions: ['ts', 'js', 'json'],
	roots: ['<rootDir>'],
	setupFiles: [],
};
