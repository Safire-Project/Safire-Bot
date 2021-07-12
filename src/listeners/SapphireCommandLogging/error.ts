/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  CommandErrorPayload,
  Listener,
  Events,
  PieceContext,
} from '@sapphire/framework';
import { TOPICS, EVENTS } from '../../lib/logger/index';

export default class CommandErrorFeedbackEvent extends Listener<
  typeof Events.CommandError
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.CommandError,
    };
    super(context, options);
  }

  // eslint-disable-next-line functional/no-return-void
  public async run(error: Error, payload: CommandErrorPayload): Promise<void> {
    // eslint-disable-next-line promise/no-promise-in-callback
    return this.container.logger.warn(
      `Command: [${payload.command.name}] - Message: [${payload.message.content}] - Error Name: [${error.name}] -  Error Message: [${error.message}]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_ERROR,
    );
  }
}
