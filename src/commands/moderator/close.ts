/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Message, StageChannel } from 'discord.js';
import { Command, PieceContext } from '@sapphire/framework';

export default class CloseCommand extends Command {
  constructor(context: PieceContext) {
    super(context, {
      enabled: false,
      name: 'close',
      description: 'Closes current channel',
      preconditions: ['GuildOnly', 'moderator-only'],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async run(message: Message): Promise<string> {
    const targetChannel =
      message.member?.guild.channels.cache
        .filter((channel) =>
          !channel.parent
            ? false
            : channel.type === 'stage' &&
              channel.parent.name.startsWith('Public'),
        )
        .sort(
          (channelOne, channelTwo) =>
            channelOne.members.size - channelTwo.members.size,
        )
        // eslint-disable-next-line unicorn/no-null
        .first() ?? null;
    return !(message?.member?.voice.channel instanceof StageChannel)
      ? Promise.reject(new Error('You are not in a stage channel'))
      : Promise.all(
          message.member.voice.channel.members.map((member) =>
            member.voice.setChannel(targetChannel),
          ),
        ).then(
          (members) => `Closed stage channel with ${members.length} members.`,
        );
  }
}
