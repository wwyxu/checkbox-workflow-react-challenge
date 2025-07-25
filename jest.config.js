export default {
    roots: [
        "<rootDir>/src"
    ],
    testMatch: [
        "**/__tests__/**/?(*.)+(test).+(ts|tsx|js)",
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testEnvironment: "node",
    moduleDirectories: ["node_modules", "./"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
}