/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { ShardingManager } from 'discord.js';
import { TOPICS, EVENTS, logger } from './lib/logger/index';

const manager = new ShardingManager('./dist/bot.js', {
  token: process.env['DISCORD_TOKEN'] ?? '',
});

function kill(): never {
  // eslint-disable-next-line unicorn/no-process-exit
  return process.exit(0);
}

manager.on('shardCreate', (shard) => {
  logger.debug(`Launched shard ${shard.id}`, {
    topic: TOPICS.DISCORD_SHARD,
    event: EVENTS.INIT,
  });
  // eslint-disable-next-line functional/no-expression-statement
  shard.on('message', (message: string) => {
    // eslint-disable-next-line functional/no-expression-statement
    if (message === 'processKill') kill(); // eslint-disable-line functional/no-conditional-statement
  });
});

const shardManagercollection = manager.spawn();
export default shardManagercollection;
