module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/tests/singleton.ts"], // Prismaのモック設定
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
