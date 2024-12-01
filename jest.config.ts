import { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^#common/(.*)$': '<rootDir>/src/common/$1',
    '^#types/(.*)$': '<rootDir>/src/types/$1',
    '^#external-models/(.*)$': '<rootDir>/src/external-models/$1',
    '^#domain/(.*)$': '<rootDir>/src/domain/$1',
    '^#infra/(.*)$': '<rootDir>/src/infra/$1',
    '^#server/(.*)$': '<rootDir>/src/server/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  roots: ['<rootDir>/src'],
};

export default config;
