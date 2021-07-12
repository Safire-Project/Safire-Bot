/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  CommandErrorPayload,
  Listener,
  Events,
  PieceContext,
} from '@sapphire/framework';
import { MessageReaction } from 'discord.js';

export default class CommandErrorFeedbackEvent extends Listener<
  typeof Events.CommandError
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.CommandError,
    };
    super(context, options);
  }

  // eslint-disable-next-line class-methods-use-this
  public async run(
    _error: Error,
    payload: CommandErrorPayload,
  ): Promise<MessageReaction> {
    return payload.message.reactions
      .removeAll()
      .then((clearedMessage) => clearedMessage.react('⁉️'));
  }
}
