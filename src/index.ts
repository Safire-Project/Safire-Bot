/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Shard, ShardingManager } from 'discord.js';
import { DeepReadonly } from 'ts-essentials';
import { TOPICS, EVENTS, logger } from './lib/logger/index';

const manager = new ShardingManager('./dist/bot.js', {
  token: process.env['DISCORD_TOKEN'] ?? '',
});

function kill(): never {
  // eslint-disable-next-line unicorn/no-process-exit, no-process-exit
  return process.exit(process.env['NODE_ENV'] === 'ci' ? 0 : 1);
}

// eslint-disable-next-line functional/no-return-void, @typescript-eslint/prefer-readonly-parameter-types
manager.on('shardCreate', (shard: DeepReadonly<Shard>) => {
  logger.debug(`Launched shard ${shard.id}`, {
    topic: TOPICS.DISCORD_SHARD,
    event: EVENTS.INIT,
  });
  // eslint-disable-next-line functional/no-expression-statement, functional/no-return-void
  shard.on('message', (message: string) => {
    // eslint-disable-next-line functional/no-expression-statement
    if (message === 'processKill') kill(); // eslint-disable-line functional/no-conditional-statement
  });
});

const shardManagerCollection = manager.spawn();
export default shardManagerCollection;
