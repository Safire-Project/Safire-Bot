/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Event, Events, PieceContext } from '@sapphire/framework';

export default class DiscordReadyCIDummyEvent extends Event<Events.Ready> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.Ready,
    });
  }

  async run(): Promise<void> {
    return process.env['NODE_ENV'] !== 'ci'
      ? Promise.resolve()
      : this.container.client.shard?.send('processKill');
  }
}
