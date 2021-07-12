/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import { EVENTS, TOPICS } from '../../../lib/logger';

export default class ShardErrorLogEvent extends Listener<
  typeof Events.ShardError
> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.ShardError,
    });
  }

  async run(error: Error, shardID: number): Promise<void> {
    return this.container.logger.error(
      `ID: [${shardID}] - Name: [${error.name}] - Message: [${
        error.message
      }] - Trace: [${error.stack ?? 'no stack trace.'}]`,
      TOPICS.DISCORD_SHARD,
      EVENTS.ERROR,
    );
  }
}
