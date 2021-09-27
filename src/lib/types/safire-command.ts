/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

// eslint-disable-next-line node/no-missing-import
import { sep } from 'node:path';
import {
  Command,
  Args,
  CommandOptions,
  PieceContext,
} from '@sapphire/framework';
import { Message } from 'discord.js';
import SafireResult from './safire-result';

export default abstract class SafireCommand extends Command {
  /**
   * The full category for the command
   * @since 0.0.1
   * @type {string[]}
   */
  public readonly fullCategory: readonly string[];

  public constructor(context: PieceContext, options: CommandOptions) {
    super(context, options);

    const paths = context.path.split(sep);
    this.fullCategory = paths.slice(paths.indexOf('commands') + 1, -1);
  }

  public abstract run(
    message: Message,
    commandArguments: Args,
  ): Promise<SafireResult>;
}
