/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { PieceContext } from '@sapphire/framework';
import { Message } from 'discord.js';
import SafireCommand from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';

export default class PingCommand extends SafireCommand {
  constructor(context: PieceContext) {
    const options = {
      name: 'ping',
      description: 'Send back the ping of the bot',
    };
    super(context, options);
  }

  async run(message: Message): Promise<SafireResult> {
    return message.channel
      .send('Ping?')
      .then(
        (pingMessage) =>
          new SafireResult(
            `Pong! Bot Latency ${Math.round(
              this.container.client.ws.ping,
            )}ms. API Latency ${
              pingMessage.createdTimestamp - message.createdTimestamp
            }ms.`,
          ),
      );
  }
}
