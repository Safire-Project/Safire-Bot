/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { MessageEmbed } from 'discord.js';

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
    this.options = resultOptions ?? { printResult: false, sendEmbed: false };
  }
}

export type SafireResultOptions = {
  readonly printResult?: boolean;
  readonly sendEmbed?: boolean;
};
