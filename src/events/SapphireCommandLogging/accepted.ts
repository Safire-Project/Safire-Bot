/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  CommandAcceptedPayload,
  Event,
  Events,
  PieceContext,
} from '@sapphire/framework';
import { TOPICS, EVENTS } from '../../lib/logger/index';

export default class CommandAcceptedLogEvent extends Event {
  constructor(context: PieceContext) {
    const options = {
      event: Events.CommandAccepted,
    };
    super(context, options);
  }

  // eslint-disable-next-line functional/no-return-void
  public async run({
    message,
    command,
  }: CommandAcceptedPayload): Promise<void> {
    return this.container.logger.debug(
      `Command: [${command.name}] - Message: [${message.content}]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_ACCEPTED,
    );
  }
}
