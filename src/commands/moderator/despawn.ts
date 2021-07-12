/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Command, PieceContext } from '@sapphire/framework';
import { CategoryChannel, GuildChannel, Message } from 'discord.js';

export default class DespawnCommand extends Command {
  constructor(context: PieceContext) {
    const options = {
      name: 'despawn',
      enabled: true,
      description:
        'Despawns all empty stage channels and if there are no public stage channels, deletes the category',
      preconditions: ['GuildOnly', 'moderator-only'],
    };
    super(context, options);
  }

  // eslint-disable-next-line class-methods-use-this, sonarjs/cognitive-complexity
  async run(message: Message): Promise<string | void> {
    return !message.guild
      ? Promise.resolve()
      : Promise.all(
          message.guild.channels.cache
            .filter(
              (cachedChannel) =>
                (cachedChannel.parent?.name.startsWith('Public') ?? false) &&
                cachedChannel.name.startsWith('Stage') &&
                cachedChannel.type === 'GUILD_STAGE_VOICE' &&
                cachedChannel.members.size === 0,
            )
            .map((filteredChannel) => filteredChannel.delete()),
        )
          .then(() => {
            return message.guild?.channels.cache.find(
              (guildChannel) =>
                guildChannel.type === 'GUILD_CATEGORY' &&
                guildChannel.name === 'Public Stages',
            );
          })
          .then((publicStageCategory) => {
            return !(publicStageCategory instanceof CategoryChannel) ||
              !publicStageCategory ||
              !publicStageCategory.children.every(
                (child) => child.type === 'GUILD_TEXT',
              )
              ? Promise.reject(
                  new Error(
                    `category ${
                      !(publicStageCategory instanceof CategoryChannel)
                        ? 'was not an instance'
                        : ''
                    } ${
                      publicStageCategory ? '' : 'was null'
                    }had a non text channel..`,
                  ),
                )
              : Promise.all(
                  publicStageCategory.children.map(async (child) =>
                    child.delete(),
                  ),
                );
          })
          .then((deletedStages) => {
            return !deletedStages || !(deletedStages[0] instanceof GuildChannel)
              ? Promise.reject(
                  new Error(
                    `channels[0] ${
                      deletedStages[0] instanceof GuildChannel
                        ? ''
                        : 'was not an instance'
                    } ${deletedStages ? '' : ', or was null'}`,
                  ),
                )
              : deletedStages[0].parent?.delete();
          })
          .then((stageCategory) => {
            return stageCategory
              ? `Despawned ${stageCategory?.toString() ?? 'but broke.'}`
              : Promise.reject(new Error('category at logging is undefined'));
          });
  }
}
