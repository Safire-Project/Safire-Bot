/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { config, createLogger, format, Logform, transports } from 'winston';
import { ReadonlyDeep } from 'type-fest';
import DiscordTransport from './discord-transport';
import NullTransport from './null-transport';
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
        format.printf(
          (info: ReadonlyDeep<Logform.TransformableInfo>): string => {
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
              timestamp as string
            } from \u001B[2m\u001B[36m${label ?? ''}\u001B[0m for ${
              event ?? 'NO EVENT GIVEN'
            } in ${topic ?? 'NO TOPIC GIVEN'} ⇒ ${message} ${
              Object.keys(rest).length > 0 ? JSON.stringify(rest) : ''
            }`;
          },
        ),
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
          webhookUrl: process.env['webhookURL'] ?? '',
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
  exitOnError: true,
});

export { EVENTS } from './events';
export { TOPICS } from './topics';
