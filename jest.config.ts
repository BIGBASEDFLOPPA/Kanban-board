module.exports = {
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '\\.module\\.css$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
    },
    testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
};