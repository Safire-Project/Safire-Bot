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
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  constructor(context: PieceContext) {
    const options = {
      event: Events.PreCommandRun,
    };
    super(context, options);
  }

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  public async run({ message, command }: PreCommandRunPayload): Promise<void> {
    this.container.logger.debug(
      `Command: [${command.name}] - Message: [${message.content}]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_PRE_RUN,
    );
  }
}
