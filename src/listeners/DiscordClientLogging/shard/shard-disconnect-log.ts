/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import { CloseEvent } from 'ws';
import { EVENTS, TOPICS } from '../../../lib/logger';

export default class ShardDisconnectLoggingEvent extends Listener<
  typeof Events.ShardDisconnect
> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.ShardDisconnect,
    });
  }

  async run(closeEvent: CloseEvent, id: number): Promise<void> {
    return this.container.logger.debug(
      `ID: [${id}] - Code: [${closeEvent.code}] - Reason: [${closeEvent.reason}]`,
      TOPICS.DISCORD_SHARD,
      EVENTS.DISCONNECT,
    );
  }
}
