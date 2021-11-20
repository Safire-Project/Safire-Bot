/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { PieceContext } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { right } from 'fp-ts/lib/Either';
import SafireCommand, { SafireEither } from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';

export default class PlayCommand extends SafireCommand {
  constructor(context: PieceContext) {
    super(context, {
      aliases: ['p', 'pl'],
      description: 'Adds a track to the audio queue.',
      detailedDescription:
        'Will add a track to the audio queue, given by a supported URL or uploaded file.',
      name: 'play',
    });
  }

  messageRun(message: Message): SafireEither {
    return right(
      new SafireResult(
        `Added ${message.content} to the queue.`,
        new MessageEmbed()
          .setAuthor(this.container.client.user?.username ?? 'Safire')
          .setColor('RANDOM')
          .setDescription(`Added to the queue.`),
      ),
    );
  }
}
