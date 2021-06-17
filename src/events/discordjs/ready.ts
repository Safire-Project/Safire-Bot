/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Event, Events, PieceContext } from '@sapphire/framework';

export default class ReadyEvent extends Event<Events.Ready> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.Ready,
    });
  }

  async run(): Promise<void> {
    // eslint-disable-next-line functional/no-conditional-statement
    if (process.env['NODE_ENV'] === 'ci') {
      this.container.client.shard?.send('processKill');
    }
    this.container.logger.info('The bot is working.');
    return Promise.resolve();
  }
}
