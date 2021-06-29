/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Event, Events, PieceContext } from '@sapphire/framework';
import { EVENTS, TOPICS } from '../../../lib/logger';

export default class DiscordDebugLogEvent extends Event<Events.Debug> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.Debug,
    });
  }

  async run(info: string): Promise<void> {
    return this.container.logger.debug(info, TOPICS.DISCORD, EVENTS.DEBUG);
  }
}
