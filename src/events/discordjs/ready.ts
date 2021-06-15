/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Event, PieceContext } from '@sapphire/framework';

export default class ReadyEvent extends Event {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
    });
  }

  async run(): Promise<void> {
    // eslint-disable-next-line functional/no-conditional-statement
    if (process.env['NODE_ENV'] === 'ci') {
      this.context.client.shard?.send('processKill');
    }
    this.context.logger.info('The bot is working.');
    return Promise.resolve();
  }
}
