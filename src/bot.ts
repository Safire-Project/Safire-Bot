/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { SapphireClient } from '@sapphire/framework';

const client = new SapphireClient({
  defaultPrefix: '?',
  intents: 32_767,
});

client
  .login(process.env['DISCORD_TOKEN'] ?? '')
  .then(() => client.logger.info('Logged In.'))
  .then(() =>
    client.logger.info(`running in ${process.env['NODE_ENV'] ?? 'unknown'}`),
  )
  .catch(() => client.logger.fatal('Could Not Log In.'));
