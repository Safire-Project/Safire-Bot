/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Command, PieceContext } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SafireCommand from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';

export default class HelpCommand extends SafireCommand {
  constructor(context: PieceContext) {
    const options = {
      name: 'help',
      description: 'Send a helpful message',
    };
    super(context, options);
  }

  async run(message: Message): Promise<SafireResult> {
    return new SafireResult(
      this.store.keyArray().toLocaleString(),
      new MessageEmbed()
        .setAuthor(
          this.container.client.user?.username ?? 'Safire',
          this.container.client.user?.displayAvatarURL(),
          'https://gitlab.com/safire-project/discord-bot/safire',
        )
        .setColor('RANDOM')
        .setFooter('To see more details try `help [command]`')
        .setThumbnail(
          'https://gitlab.com/uploads/-/system/project/avatar/26640181/saffire.png',
        )
        .setTitle('Read Detailed Documentation And Source Code Here')
        .setURL('https://gitlab.com/safire-project/discord-bot/safire')
        .addField(
          'Server Prefix Options',
          (
            await this.container.client.fetchPrefix(message)
          )?.toLocaleString() ??
            `No prefix set, mention me (${
              this.container.client.user?.toString() ?? 'this bot'
            }) instead!`,
        )
        .addFields(
          this.store
            .map((command) =>
              !(command instanceof Command) || !command.enabled
                ? { name: '', value: '' }
                : {
                    name: command.name,
                    value: command.description,
                  },
            )
            .filter((field) => field.name !== ''),
        ),
      {
        printResult: true,
        sendEmbed: true,
      },
    );
  }
}
