/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import { EVENTS, TOPICS } from '../../../lib/logger';

export default class DiscordErrorLoggingEvent extends Listener<
  typeof Events.Error
> {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.Error,
    });
  }

  async run(error: Readonly<Error>): Promise<void> {
    return this.container.logger.error(
      `[${error.name}] - [${error.message}] - [${
        error.stack ?? 'no stack trace.'
      }]`,
      TOPICS.DISCORD,
      EVENTS.ERROR,
    );
  }
}
