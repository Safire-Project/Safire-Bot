/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { GuildChannel, Message, TextChannel } from 'discord.js';
import { PieceContext } from '@sapphire/framework';
import SafireCommand from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';

export default class SpawnCommand extends SafireCommand {
  readonly stageCategoryName: string;

  constructor(context: PieceContext) {
    super(context, {
      aliases: ['sp'],
      enabled: false,
      name: 'spawn',
      description: 'Spawns a new stage channel.',
      preconditions: ['GuildOnly', 'moderator-only'],
    });
    this.stageCategoryName = 'Public Stages';
  }

  readonly spawnUnique = async function spawnNewUniqueTextChannel(
    name: string,
    description: string,
    sourceChannel: GuildChannel | undefined,
  ): Promise<TextChannel> {
    return !sourceChannel ||
      !sourceChannel.parent ||
      sourceChannel.parent.children.some((child) => child.name === name)
      ? Promise.reject(
          new Error(
            'No source channel, source parent, or channel with sibling name already exists',
          ),
        )
      : sourceChannel.guild.channels.create(name, {
          type: 'text',
          topic: description,
          parent: sourceChannel.parent.id ?? sourceChannel.guild.id,
        });
  };

  async run(message: Message): Promise<SafireResult> {
    return !message.guild
      ? Promise.reject(new Error('Must be run in guild'))
      : message.guild.channels
          .create(
            `Stage ${
              message.guild.channels.cache.filter((channel) =>
                channel.name.startsWith('Stage'),
              ).size + 1
            }`,
            {
              type: 'stage',
              permissionOverwrites: [
                {
                  id:
                    message.guild.roles.cache.find(
                      (role) => role.name === '@everyone',
                    ) ?? message.guild.id,
                  allow: ['CONNECT'],
                },
              ],
              parent:
                message.guild.channels.cache.find(
                  (channel) =>
                    channel.type === 'category' &&
                    channel.name === this.stageCategoryName,
                ) ??
                (await message.guild.channels.create(this.stageCategoryName, {
                  type: 'category',
                  position: 2,
                  permissionOverwrites: [
                    {
                      id: message.guild.id,
                      allow: ['CONNECT', 'SEND_MESSAGES'],
                    },
                  ],
                })),
            },
          )
          .then((stageChannel) =>
            !stageChannel
              ? Promise.reject(new Error('Stage Channel not spawned.'))
              : this.spawnUnique(
                  'topic-request',
                  'This channel is where you can suggest a topic that you\'d like to discuss on stage. Type "@moderator topic suggestion: [your topic here]" and be ready to speak!',
                  stageChannel,
                ),
          )
          .then((discussionChannel) =>
            !discussionChannel || !discussionChannel.parent
              ? Promise.reject(new Error('No Discussion Channel'))
              : new SafireResult(
                  `Made Channel: Stage ${
                    discussionChannel.parent.children.size - 1
                  }`,
                ),
          );
  }
}
