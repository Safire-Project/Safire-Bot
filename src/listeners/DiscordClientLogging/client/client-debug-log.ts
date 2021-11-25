/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import { EVENTS, TOPICS } from '../../../lib/logger';

export default class DiscordDebugLoggingEvent extends Listener<
  typeof Events.Debug
> {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.Debug,
    });
  }

  async run(info: string): Promise<void> {
    return this.container.logger.debug(info, TOPICS.DISCORD, EVENTS.DEBUG);
  }
}
