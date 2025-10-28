/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	moduleNameMapper: {
		'^(.+)\\.js$': '$1',
	},
	testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
	transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
