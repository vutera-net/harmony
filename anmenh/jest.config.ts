import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/\$1",
    "^react$": "<rootDir>/node_modules/react",
    "^react-dom$": "<rootDir>/node_modules/react-dom",
  },
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", {
      tsconfig: "tsconfig.json",
    }],
  },
};

export default config;
