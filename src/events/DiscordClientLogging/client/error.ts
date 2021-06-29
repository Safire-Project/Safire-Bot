/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Event, Events, PieceContext } from '@sapphire/framework';
import { EVENTS, TOPICS } from '../../../lib/logger';

export default class DiscordErrorLogEvent extends Event<Events.Error> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.Error,
    });
  }

  async run(error: Error): Promise<void> {
    return this.container.logger.error(
      `[${error.name}] - [${error.message}] - [${
        error.stack ?? 'no stack trace.'
      }]`,
      TOPICS.DISCORD,
      EVENTS.ERROR,
    );
  }
}
