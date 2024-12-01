import { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from './tsconfig.json';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  roots: ['<rootDir>/src'],
};

export default config;
