/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Event, Events, PieceContext } from '@sapphire/framework';
import { EVENTS, TOPICS } from '../../../lib/logger';

export default class DiscordReadyLogEvent extends Event<Events.Ready> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.Ready,
    });
  }

  async run(): Promise<void> {
    return this.container.logger.debug(
      'Ready event emitted',
      TOPICS.DISCORD,
      EVENTS.READY,
    );
  }
}
