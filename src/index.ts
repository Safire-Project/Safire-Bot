/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { SapphireClient } from '@sapphire/framework';

const client = new SapphireClient({
  defaultPrefix: '?',
});

client
  .login(process.env['DISCORD_TOKEN'] ?? '')
  .then(() => client.logger.info('Logged In.'))
  .catch(() => client.logger.fatal('Could Not Log In.'));
