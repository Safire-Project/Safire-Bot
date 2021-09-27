/* eslint-disable header/header, functional/no-return-void, class-methods-use-this */
/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { ILogger, LogLevel } from '@sapphire/framework';
import { logger } from './index';

export default class SafireLogger implements ILogger {
  public readonly level: LogLevel;

  public constructor(level: LogLevel) {
    this.level = level;
  }

  public has(level: LogLevel): boolean {
    return level >= this.level;
  }

  trace(
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void {
    logger.silly(message, { topic, event }, values);
  }

  silly(
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void {
    logger.silly(message, { topic, event }, values);
  }

  input(
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void {
    logger.input(message, { topic, event }, values);
  }

  verbose(
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void {
    logger.verbose(message, { topic, event }, values);
  }

  prompt(
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void {
    logger.prompt(message, { topic, event }, values);
  }

  debug(
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void {
    logger.debug(message, { topic, event }, values);
  }

  info(
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void {
    logger.info(message, { topic, event }, values);
  }

  data(
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void {
    logger.data(message, { topic, event }, values);
  }

  help(
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void {
    logger.help(message, { topic, event }, values);
  }

  warn(
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void {
    logger.warn(message, { topic, event }, values);
  }

  error(
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void {
    logger.error(message, { topic, event }, values);
  }

  fatal(
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void {
    logger.error(message, { topic, event }, values);
  }

  write(
    level: LogLevel,
    message: string,
    topic: string,
    event: string,
    ...values: readonly unknown[]
  ): void {
    logger.info(message, { topic, event }, level, values);
  }
}
/* eslint-enable header/header, functional/no-return-void, class-methods-use-this */
