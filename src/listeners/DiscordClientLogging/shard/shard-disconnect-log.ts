/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import { CloseEvent } from 'discord.js';
import { DeepReadonly } from 'ts-essentials';
import { EVENTS, TOPICS } from '../../../lib/logger';

export default class ShardDisconnectLoggingEvent extends Listener<
  typeof Events.ShardDisconnect
> {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.ShardDisconnect,
    });
  }

  async run(
    closeEvent: DeepReadonly<CloseEvent>,
    shardID: number,
  ): Promise<void> {
    return this.container.logger.debug(
      `ID: [${shardID}] - Code: [${closeEvent.code}] - Reason: [${closeEvent.reason}]`,
      TOPICS.DISCORD_SHARD,
      EVENTS.DISCONNECT,
    );
  }
}
