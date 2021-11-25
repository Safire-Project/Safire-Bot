/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import { EVENTS, TOPICS } from '../../../lib/logger';

export default class ShardReconnectingLoggingEvent extends Listener<
  typeof Events.ShardReconnecting
> {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.ShardReconnecting,
    });
  }

  async run(id: number): Promise<void> {
    return this.container.logger.debug(
      `ID: [${id}]`,
      TOPICS.DISCORD_SHARD,
      EVENTS.RECONNECTING,
    );
  }
}
