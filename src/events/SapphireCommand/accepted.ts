/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  CommandAcceptedPayload,
  Event,
  Events,
  PieceContext,
} from '@sapphire/framework';
import { MessageReaction } from 'discord.js';

export default class CommandAcceptedFeedbackEvent extends Event {
  constructor(context: PieceContext) {
    const options = {
      event: Events.CommandAccepted,
    };
    super(context, options);
  }

  // eslint-disable-next-line class-methods-use-this
  public async run({
    message,
  }: CommandAcceptedPayload): Promise<MessageReaction> {
    return message.reactions.removeAll().then(() => message.react('➕'));
  }
}
