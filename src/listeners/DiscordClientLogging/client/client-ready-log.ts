/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import { EVENTS, TOPICS } from '../../../lib/logger';

export default class DiscordReadyLoggingEvent extends Listener<
  typeof Events.ClientReady
> {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.ClientReady,
    });
  }

  async run(): Promise<void> {
    return this.container.logger.debug(
      'Ready event emitted',
      TOPICS.DISCORD,
      EVENTS.READY,
    );
  }
}
