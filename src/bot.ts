/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { SapphireClient } from '@sapphire/framework';
import { TOPICS, EVENTS } from './lib/logger/index';
import SafireLogger from './lib/logger/safire-logger';

const client = new SapphireClient({
  defaultPrefix: '?!',
  intents: 32_767,
  logger: {
    instance: new SafireLogger(),
  },
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
  presence: { afk: false, status: 'online', activities: [{ name: '?help' }] },
});

client
  .login(process.env['DISCORD_TOKEN'] ?? '')
  .then(() =>
    client.logger.info(
      `Logged In. Running in ${process.env['NODE_ENV'] ?? 'unknown'}`,
      TOPICS.DISCORD,
      EVENTS.INIT,
    ),
  )
  .catch(() =>
    client.logger.fatal('Could Not Log In.', TOPICS.DISCORD, EVENTS.ERROR),
  );

export default client;
