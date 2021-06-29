/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Event, Events, PieceContext } from '@sapphire/framework';
import { EVENTS, TOPICS } from '../../../lib/logger';

export default class ShardResumeLogEvent extends Event<Events.ShardResume> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.ShardResume,
    });
  }

  async run(id: number, replayedEvents: number): Promise<void> {
    return this.container.logger.debug(
      `ID: [${id} - Replayed Event Count: [${replayedEvents}]`,
      TOPICS.DISCORD_SHARD,
      EVENTS.ERROR,
    );
  }
}
