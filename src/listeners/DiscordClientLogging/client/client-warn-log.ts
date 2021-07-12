/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import { EVENTS, TOPICS } from '../../../lib/logger';

export default class DiscordWarnLoggingEvent extends Listener<
  typeof Events.Warn
> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.Warn,
    });
  }

  async run(info: string): Promise<void> {
    return this.container.logger.warn(info, TOPICS.DISCORD, EVENTS.WARN);
  }
}
