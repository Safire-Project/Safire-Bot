/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { PieceContext } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SafireCommand from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';

export default class PingCommand extends SafireCommand {
  constructor(context: PieceContext) {
    const options = {
      name: 'ping',
      description: 'Sends the ping and latency of Safire.',
    };
    super(context, options);
  }

  async run(message: Message): Promise<SafireResult> {
    return message.channel
      .send('Ping?')
      .then((pingMessage) => pingMessage.delete())
      .then(
        (deletedMessage) =>
          new SafireResult(
            `Pong! Bot Latency ${Math.round(
              this.container.client.ws.ping,
            )}ms. API Latency ${
              deletedMessage.createdTimestamp - message.createdTimestamp
            }ms.`,
            new MessageEmbed().setAuthor(
              this.container.client.user?.username ?? 'Safire',
            ),
            { printResult: true, sendEmbed: true },
          ),
      );
  }
}
