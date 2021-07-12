/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  PreCommandRunPayload,
  Listener,
  Events,
  PieceContext,
} from '@sapphire/framework';
import { TOPICS, EVENTS } from '../../lib/logger/index';

export default class PreCommandRunLoggingEvent extends Listener<
  typeof Events.PreCommandRun
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.PreCommandRun,
    };
    super(context, options);
  }

  // eslint-disable-next-line functional/no-return-void
  public async run({ message, command }: PreCommandRunPayload): Promise<void> {
    this.container.logger.debug(
      `Command: [${command.name}] - Message: [${message.content}]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_PRE_RUN,
    );
  }
}
