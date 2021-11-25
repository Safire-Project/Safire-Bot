/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { PieceContext } from '@sapphire/framework';
import { bold, compose, underline } from 'discord-md-tags';
import { MessageEmbed } from 'discord.js';
import { right } from 'fp-ts/lib/Either';
import SafireCommand, { SafireEither } from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';
import { ReadonlyDiscordEmbedField } from '../../lib/types/util';

export default class AboutCommand extends SafireCommand {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  constructor(context: PieceContext) {
    super(context, {
      aliases: ['a', 'safire', 'botinfo', 'safireinfo', 'saf'],
      name: 'about',
      description: 'Sends details about Safire.',
      detailedDescription:
        'Prints out detailed information for Safire. Includes a bot invite, discord server invite, source code, social media, donation pages, and version information.',
    });
  }

  async messageRun(): Promise<SafireEither> {
    return right(
      new SafireResult(
        'Printed Safire Details',
        new MessageEmbed()
          .setAuthor(
            process.env['npm_package_name'] ??
              this.container.client.user?.username ??
              'Safire',
            this.container.client.user?.displayAvatarURL(),
          )
          .setColor('AQUA')
          .setDescription(
            'Safire is a feature-rich Discord Bot written in TypeScript with modern frameworks and highly opinionated style choices. In particular it is a rewrite of [Ember](https://gitlab.com/BrynAlt/ember-bot) in the [Sapphire](https://github.com/sapphiredev/framework) framework. Safire will always be free as in freedom and as in free beer.',
          )
          .setFooter(
            'Safire is distributed under the MIT License or the CC0 License',
          )
          .setThumbnail(
            'https://gitlab.com/safire-project/discord-bot/safire/-/raw/master/assets/icon/256x256.png',
          )
          .setTitle('Safire Discord Bot')
          .setURL('https://gitlab.com/safire-project/discord-bot/safire')
          .addFields(
            [
              {
                name: 'Invites',
                value:
                  // eslint-disable-next-line no-secrets/no-secrets
                  `🔗 [Add ${
                    this.container.client.user?.username ?? 'Safire'
                  } To Your Server](${
                    process.env['INVITE_LINK'] ??
                    'https://gitlab.com/safire-project/discord-bot/safire'
                  })\n` +
                  '🔥 [Join The Safire Discord Server](https://discord.gg/KtjsnPBHwC)',
              },
              {
                name: 'Source',
                value:
                  '🦊 [Gitlab](https://gitlab.com/safire-project/discord-bot/safire)\n' +
                  '🐙 [Github](https://github.com/Safire-Project/Safire-Bot)',
              },
              {
                name: 'Socials',
                value: '🐦 [Twitter](https://twitter.com/PhiloSofiaAlt)',
              },
              {
                name: 'Donate',
                value:
                  '💰 [Patreon](https://www.patreon.com/safirebot)\n' +
                  '☕ [Ko-fi](https://ko-fi.com/brynalt)\n' +
                  '🦉 [Issue Hunt](https://issuehunt.io/r/Safire-Project/Safire-Bot)',
              },
              {
                name: 'Version',
                value: `${
                  process.env['COMMIT'] ??
                  process.env['npm_package_version'] ??
                  'No Version Information Available'
                }`,
              },
            ].map((field: ReadonlyDiscordEmbedField) => ({
              name: compose(bold, underline)`${field.name}`,
              value: field.value,
            })),
          ),
        {
          printResult: true,
          sendPayload: true,
        },
      ),
    );
  }
}
