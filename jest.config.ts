import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  roots: ["<rootDir>"],
  testMatch: ["**/*.spec.ts"],
  moduleFileExtensions: ["ts", "js", "json"]
};

export default config;