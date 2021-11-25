/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  CommandErrorPayload,
  Listener,
  Events,
  PieceContext,
} from '@sapphire/framework';
import { TOPICS, EVENTS } from '../../lib/logger/index';

export default class CommandErrorLoggingEvent extends Listener<
  typeof Events.CommandError
> {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  constructor(context: PieceContext) {
    const options = {
      event: Events.CommandError,
    };
    super(context, options);
  }

  // eslint-disable-next-line functional/no-return-void
  public async run(
    error: Readonly<Error>,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    payload: CommandErrorPayload,
  ): Promise<void> {
    return this.container.logger.warn(
      `Command: [${payload.command.name}] - Message: [${payload.message.content}] - Error Name: [${error.name}] -  Error Message: [${error.message}]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_ERROR,
    );
  }
}
