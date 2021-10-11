/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { PieceContext } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SafireCommand from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';

export default class PingCommand extends SafireCommand {
  constructor(context: PieceContext) {
    super(context, {
      aliases: ['gateway', 'latency'],
      description: 'Sends the ping and latency of Safire.',
      detailedDescription:
        'Calculates a full round trip for the Discord websocket.',
      name: 'ping',
    });
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
            new MessageEmbed()
              .setAuthor(this.container.client.user?.username ?? 'Safire')
              .setColor('RANDOM')
              .setDescription(
                `Details for __**${
                  this.container.client.ws.gateway ?? 'gateway'
                }**__`,
              )
              .addFields([
                {
                  name: 'Bot Latency',
                  value: `${Math.round(this.container.client.ws.ping)}ms`,
                  inline: true,
                },
                {
                  name: 'API Latency',
                  value: `${
                    deletedMessage.createdTimestamp - message.createdTimestamp
                  }ms`,
                  inline: true,
                },
              ]),
            { printResult: true, sendPayload: true },
          ),
      );
  }
}
