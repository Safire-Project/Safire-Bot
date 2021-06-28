/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Command, Args } from '@sapphire/framework';
import { Message } from 'discord.js';
import SafireResult from './safire-result';

export default abstract class SafireCommand extends Command {
  public abstract run(
    message: Message,
    commandArguments: Args,
  ): Promise<SafireResult>;
}
