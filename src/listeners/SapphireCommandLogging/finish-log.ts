/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  CommandFinishPayload,
  Listener,
  Events,
  PieceContext,
} from '@sapphire/framework';
import { Message } from 'discord.js';
import SafireCommand from '../../lib/types/safire-command';
import { TOPICS, EVENTS } from '../../lib/logger/index';

export default class CommandFinishLoggingEvent extends Listener<
  typeof Events.CommandFinish
> {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  constructor(context: PieceContext) {
    const options = {
      event: Events.CommandFinish,
    };
    super(context, options);
  }

  public async run(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    message: Message,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    command: SafireCommand,
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    payload: CommandFinishPayload,
  ): Promise<void> {
    this.container.logger.debug(
      `Command: [${command.name}] - Message: [${
        message.content
      }] - Parameters: [${payload.parameters.toString()}]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_FINISHED,
    );
  }
}
