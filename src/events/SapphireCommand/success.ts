/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  CommandSuccessPayload,
  Event,
  Events,
  PieceContext,
} from '@sapphire/framework';
import { Message, PartialMessage } from 'discord.js';

import SafireResult from '../../lib/types/safire-result';

export default class CommandSuccessFeedbackEvent extends Event {
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
    return message.reactions
      .removeAll()
      .then((clearedMessage) => clearedMessage.react('✅'))
      .then((messageReaction) =>
        typeof result !== 'string'
          ? !(result instanceof SafireResult)
            ? Promise.reject(new Error(`No result data from ${command.name}`))
            : !result.options.printResult
            ? messageReaction.message
            : messageReaction.message.reply(
                result.options.sendEmbed
                  ? { embeds: [result.embed] }
                  : result.message,
              )
          : messageReaction.message.reply(result),
      );
  }
}
