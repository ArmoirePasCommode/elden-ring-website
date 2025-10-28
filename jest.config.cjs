/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	transform: {
		'^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	// mappe seulement les imports relatifs se terminant par .js vers le même chemin sans extension
	// évite de remapper des paquets node_modules comme "ipaddr.js"
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
	transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
