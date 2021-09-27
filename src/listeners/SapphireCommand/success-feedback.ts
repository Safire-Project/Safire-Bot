/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  CommandSuccessPayload,
  Listener,
  Events,
  PieceContext,
} from '@sapphire/framework';
import { Message, PartialMessage } from 'discord.js';

import SafireResult from '../../lib/types/safire-result';

export default class CommandSuccessFeedbackEvent extends Listener<
  typeof Events.CommandSuccess
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.CommandSuccess,
    };
    super(context, options);
  }

  // eslint-disable-next-line class-methods-use-this
  public async run({
    command,
    message,
    result,
  }: CommandSuccessPayload): Promise<Message | PartialMessage> {
    return typeof result !== 'string'
      ? !(result instanceof SafireResult)
        ? Promise.reject(new Error(`No result data from ${command.name}`))
        : !result.options.printResult
        ? message
        : message.reply(
            result.options.sendEmbed
              ? { embeds: [result.embed] }
              : result.message,
          )
      : message.reply(result);
  }
}
