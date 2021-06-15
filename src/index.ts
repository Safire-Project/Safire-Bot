/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { ShardingManager } from 'discord.js';

const manager = new ShardingManager('./dist/bot.js', {
  token: process.env['DISCORD_TOKEN'] ?? '',
});

// eslint-disable-next-line no-console
manager.on('shardCreate', (shard) => console.log(`Launched shard ${shard.id}`));
const shardManagercollection = await manager.spawn();
export default shardManagercollection;
