/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import { EVENTS, TOPICS } from '../../../lib/logger';

export default class ShardResumeLoggingEvent extends Listener<
  typeof Events.ShardResume
> {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
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
