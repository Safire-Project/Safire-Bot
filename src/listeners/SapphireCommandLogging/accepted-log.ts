/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  CommandAcceptedPayload,
  Listener,
  Events,
  PieceContext,
} from '@sapphire/framework';
import { TOPICS, EVENTS } from '../../lib/logger/index';

export default class CommandAcceptedLoggingEvent extends Listener<
  typeof Events.CommandAccepted
> {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  constructor(context: PieceContext) {
    const options = {
      event: Events.CommandAccepted,
    };
    super(context, options);
  }

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
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
