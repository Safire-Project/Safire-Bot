/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Command, PieceContext } from '@sapphire/framework';
import { Message } from 'discord.js';

export default class PingCommand extends Command {
  constructor(context: PieceContext) {
    const options = {
      name: 'ping',
      description: 'Send back the ping of the bot',
    };
    super(context, options);
  }

  async run(message: Message): Promise<Message> {
    const sentMessage = await message.channel.send('Ping?');
    return sentMessage.edit(
      `Pong! Bot Latency ${Math.round(
        this.context.client.ws.ping,
      )}ms. API Latency ${
        sentMessage.createdTimestamp - message.createdTimestamp
      }ms.`,
    );
  }
}
