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
    this.context.logger.info('The bot is working.');
    return process.env['DISCORD_TOKEN'] === 'ci'
      ? process.exit(0) // eslint-disable-line unicorn/no-process-exit
      : Promise.resolve();
  }
}
