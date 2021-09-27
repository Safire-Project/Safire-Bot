/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  CommandDeniedPayload,
  Listener,
  Events,
  PieceContext,
  UserError,
} from '@sapphire/framework';
import { TOPICS, EVENTS } from '../../lib/logger/index';

export default class CommandDeniedLoggingEvent extends Listener<
  typeof Events.CommandDenied
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.CommandDenied,
    };
    super(context, options);
  }

  // eslint-disable-next-line functional/no-return-void
  public async run(
    error: UserError,
    { message, command }: CommandDeniedPayload,
  ): Promise<void> {
    this.container.logger.debug(
      `Command: [${command.name}] - Message: [${message.content}] Error: [${error.message}]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_DENIED,
    );
  }
}
