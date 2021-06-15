/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { ShardingManager } from 'discord.js';

const manager = new ShardingManager('./dist/bot.js', {
  token: process.env['DISCORD_TOKEN'] ?? '',
});

function kill(): never {
  // eslint-disable-next-line unicorn/no-process-exit
  return process.exit(0);
}

manager.on('shardCreate', (shard) => {
  console.log(`Launched shard ${shard.id}`); // eslint-disable-line no-console
  // eslint-disable-next-line functional/no-expression-statement
  shard.on('message', (message: string) => {
    // eslint-disable-next-line functional/no-expression-statement
    if (message === 'processKill') kill(); // eslint-disable-line functional/no-conditional-statement
  });
});

const shardManagercollection = await manager.spawn();
export default shardManagercollection;
