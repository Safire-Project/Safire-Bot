/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import { EVENTS, TOPICS } from '../../../lib/logger';

export default class ShardReconnectingLogEvent extends Listener<
  typeof Events.ShardReady
> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.ShardReady,
    });
  }

  async run(
    id: number,
    unavailableGuilds: ReadonlySet<`${bigint}`> | undefined,
  ): Promise<void> {
    return this.container.logger.debug(
      `ID: [${id}] - Unavailable: [${
        unavailableGuilds?.size ?? 'No Unavailable Data Given'
      }]`,
      TOPICS.DISCORD_SHARD,
      EVENTS.READY,
    );
  }
}
