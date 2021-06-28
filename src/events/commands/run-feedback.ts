/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  CommandRunPayload,
  Event,
  Events,
  PieceContext,
} from '@sapphire/framework';
import { Message } from 'discord.js';
import SafireCommand from '../../lib/types/safire-command';
import { TOPICS, EVENTS } from '../../lib/logger/index';

export default class CommandRunFeedbackEvent extends Event {
  constructor(context: PieceContext) {
    const options = {
      event: Events.CommandRun,
    };
    super(context, options);
  }

  // eslint-disable-next-line functional/no-return-void
  public async run(
    message: Message,
    command: SafireCommand,
    payload: CommandRunPayload,
  ): Promise<void> {
    this.container.logger.debug(
      `Command: [${command.name}] - Message: [${
        message.content
      }] - Parameters: [${payload.parameters.toString()}]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_RUN,
    );
  }
}
