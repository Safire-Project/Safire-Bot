/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

// eslint-disable-next-line node/no-unpublished-import
import type { Config } from '@types/jest';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
export default config;
