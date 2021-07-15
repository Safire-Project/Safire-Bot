/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Args, PieceContext } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import SafireCommand from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';

export default class HelpCommand extends SafireCommand {
  constructor(context: PieceContext) {
    const options = {
      name: 'help',
      description: 'Sends a helpful message.',
    };
    super(context, options);
  }

  async run(message: Message, commandArguments: Args): Promise<SafireResult> {
    return (await commandArguments.start().peekResult('string')).success
      ? commandArguments
          .peek('string')
          .then(
            (commandKey) =>
              this.container.stores.get('commands').get(commandKey) ??
              Promise.reject(new Error(`There is no command ${commandKey}`)),
          )
          .then(
            (command) =>
              new SafireResult(
                `Name: ${command.name}\nDescription: ${
                  command.description
                }\nDetailed Description: ${
                  command.detailedDescription
                }\nAliases: ${command.aliases.toLocaleString()}\nEnabled: ${String(
                  command.enabled,
                )}`,
                new MessageEmbed()
                  .setAuthor(this.container.client.user?.username ?? 'Safire')
                  .setColor('RANDOM')
                  .setDescription(command.description)
                  .setFooter('To see all commands try 𝚑𝚎𝚕𝚙 alone')
                  .setThumbnail(
                    'https://gitlab.com/uploads/-/system/project/avatar/26640181/saffire.png',
                  )
                  .setTitle(command.name)
                  .setURL(
                    // eslint-disable-next-line sonarjs/no-duplicate-string
                    process.env['GIT_BRANCH'] ??
                      'https://gitlab.com/safire-project/discord-bot/safire/-/tree/master',
                  )
                  .addFields(
                    [
                      { name: 'Details', value: command.detailedDescription },
                      {
                        name: 'Aliases',
                        value: command.aliases.toLocaleString(),
                      },
                      { name: 'Path', value: command.path },
                    ].filter((field) => field.value.length > 0),
                  ),
                {
                  printResult: true,
                  sendEmbed: true,
                },
              ),
          )
      : Promise.all(
          this.store
            .array()
            .filter((piece): piece is SafireCommand => 'preconditions' in piece)
            .map((command) => command.preconditions.run(message, command)),
        ).then(
          async (printableCommands) =>
            new SafireResult(
              this.store.keyArray().toLocaleString(),
              new MessageEmbed()
                .setAuthor(
                  this.container.client.user?.username ?? 'Safire',
                  this.container.client.user?.displayAvatarURL(),
                  'https://gitlab.com/safire-project/discord-bot/safire',
                )
                .setColor('RANDOM')
                .setFooter('To see more details try 𝚑𝚎𝚕𝚙 [𝚌𝚘𝚖𝚖𝚊𝚗𝚍]')
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
                    .array()
                    .filter(
                      (piece): piece is SafireCommand => 'description' in piece,
                    )
                    .filter(
                      (_command, index) => printableCommands[index]?.success,
                    )
                    .map((printableCommand) => ({
                      name: printableCommand.name,
                      value: `${printableCommand.description}`,
                    })),
                ),
              {
                printResult: true,
                sendEmbed: true,
              },
            ),
        );
  }
}
