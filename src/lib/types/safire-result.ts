/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { MessageEmbed, MessageOptions, MessagePayload } from 'discord.js';
export default class SafireResult {
  public readonly message: string;

  public readonly payload: MessagePayload | MessageOptions;

  public readonly options: SafireResultOptions;

  constructor(
    resultMessage: string,
    outputPackage?: MessageEmbed | MessagePayload | MessageOptions,
    resultOptions?: SafireResultOptions,
  ) {
    this.message = resultMessage ?? 'no result message given';
    this.message = resultMessage
      ? resultMessage
      : outputPackage instanceof MessageEmbed && outputPackage.description
      ? outputPackage.description
      : 'no result message given';
    this.payload =
      outputPackage instanceof MessageEmbed
        ? { embeds: [outputPackage] }
        : outputPackage ?? { content: resultMessage };
    this.options = resultOptions ?? { printResult: false, sendPayload: false };
  }
}

export type SafireResultOptions = {
  readonly printResult?: boolean;
  readonly sendPayload?: boolean;
};
