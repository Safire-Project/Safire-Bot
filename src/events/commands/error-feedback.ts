/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  CommandErrorPayload,
  Event,
  Events,
  PieceContext,
} from '@sapphire/framework';
import { TOPICS, EVENTS } from '../../lib/logger/index';

export default class CommandErrorFeedbackEvent extends Event {
  constructor(context: PieceContext) {
    const options = {
      event: Events.CommandError,
    };
    super(context, options);
  }

  // eslint-disable-next-line functional/no-return-void
  public async run(error: Error, payload: CommandErrorPayload): Promise<void> {
    // eslint-disable-next-line promise/no-promise-in-callback
    return payload.message.reactions
      .removeAll()
      .then((clearedMessage) => clearedMessage.react('⁉️'))
      .then((messageReaction) =>
        messageReaction.message.reply(
          `Command Failed: ${error.name} - ${error.message}`,
        ),
      )
      .then(() =>
        this.container.logger.warn(
          `Command: [${payload.command.name}] - Message: [${payload.message.content}] - Error Name: [${error.name}] -  Error Message: [${error.message}]`,
          TOPICS.SAPPHIRE,
          EVENTS.COMMAND_ERROR,
        ),
      );
  }
}
