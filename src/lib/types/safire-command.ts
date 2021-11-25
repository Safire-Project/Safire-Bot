/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

// eslint-disable-next-line node/no-missing-import
import { sep } from 'node:path';
import {
  Command,
  Args,
  CommandOptions,
  PieceContext,
  CommandSuccessPayload,
} from '@sapphire/framework';
import { Message } from 'discord.js';
import { Either } from 'fp-ts/lib/Either';
import SafireResult from './safire-result';

export type SafireEither = Either<Error, SafireResult>;

export type SafireCommandSuccessPayload = CommandSuccessPayload & {
  readonly result: Awaited<Promise<SafireEither>>;
};
export default abstract class SafireCommand extends Command {
  /**
   * The full category for the command
   * @since 0.0.1
   * @type {string[]}
   */
  public readonly fullCategory: readonly string[];

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  public constructor(context: PieceContext, options: Readonly<CommandOptions>) {
    super(context, options);

    const paths = context.path.split(sep);
    this.fullCategory = paths.slice(paths.indexOf('commands') + 1, -1);
  }

  public abstract messageRun(
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    message: Message,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    commandArguments: Args,
  ): Promise<SafireEither> | SafireEither;
}
