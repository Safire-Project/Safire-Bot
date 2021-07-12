/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Listener, Events, PieceContext } from '@sapphire/framework';

export default class DiscordReadyCIDummyEvent extends Listener<
  typeof Events.ClientReady
> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.ClientReady,
    });
  }

  async run(): Promise<void> {
    return process.env['NODE_ENV'] !== 'ci'
      ? Promise.resolve()
      : this.container.client.shard?.send('processKill');
  }
}
