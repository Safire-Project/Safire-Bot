/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { MessageEmbed } from 'discord.js';
import SafireResultOptions from './safire-result-options';

export default class SafireResult {
  public readonly message: string;

  public readonly embed: MessageEmbed;

  public readonly options: SafireResultOptions;

  constructor(
    resultMessage: string,
    outputEmbed?: MessageEmbed,
    resultOptions?: SafireResultOptions,
  ) {
    this.message =
      resultMessage ?? outputEmbed?.description ?? 'no result message given';
    this.embed =
      outputEmbed ?? new MessageEmbed({ description: resultMessage });
    this.options = resultOptions ?? new SafireResultOptions();
  }
}
