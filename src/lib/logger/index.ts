/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Snowflake } from 'discord.js';
/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { config, createLogger, format, Logform, transports } from 'winston';
import DiscordTransport from './discord-transport';
import { EVENTS as EVENTS_ENUM } from './events';
import NullTransport from './null-transport';
import { TOPICS as TOPICS_ENUM } from './topics';
import 'winston-daily-rotate-file';

export const logger = createLogger({
  levels: config.cli.levels,
  format: format.combine(
    format.label({ label: `Safire (${process.pid})` }),
    format.errors({ stack: true }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({ level: true, message: true }),
        format.timestamp({ format: 'HH:mm:ss' }),
        format.printf((info: Logform.TransformableInfo): string => {
          const {
            timestamp,
            label,
            level,
            message,
            topic,
            event,
            ...rest
          }: Logform.TransformableInfo & {
            readonly event?: string;
            readonly label?: string;
            readonly topic?: string;
          } = info;
          return `\u001B[7m${level}\u001B[0m ${
            timestamp as string // eslint-disable-line total-functions/no-unsafe-type-assertion
          } from \u001B[2m\u001B[36m${label ?? ''}\u001B[0m for ${
            event ?? 'NO EVENT GIVEN'
          } in ${topic ?? 'NO TOPIC GIVEN'} ⇒ ${message} ${
            Object.keys(rest).length > 0 ? JSON.stringify(rest) : ''
          }`;
        }),
      ),
      level: process.env['NODE_ENV'] === 'development' ? 'verbose' : 'debug',
    }),
    new transports.DailyRotateFile({
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
      ),
      level: 'debug',
      dirname: './logs/',
      filename: 'Safire-%DATE%.log',
      maxFiles: '30d',
    }),
    process.env['NO_DISCORD']
      ? new NullTransport({})
      : new DiscordTransport({
          // eslint-disable-next-line total-functions/no-unsafe-type-assertion
          webhookID: `${BigInt(process.env['webhookID'] ?? '')}` as Snowflake,
          webhookToken: process.env['webhookToken'] ?? '',
          level: 'info',
        }),
    new transports.File({
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
      ),
      filename: 'debugging.log',
      dirname: './logs/',
      level: process.env['NODE_ENV']?.localeCompare('development')
        ? 'silly'
        : 'help',
    }),
  ],
  exitOnError: false,
});

export const EVENTS = EVENTS_ENUM;
export const TOPICS = TOPICS_ENUM;
