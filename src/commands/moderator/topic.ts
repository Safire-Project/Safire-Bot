/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Message, StageChannel } from 'discord.js';
import { Args, PieceContext } from '@sapphire/framework';
import SafireCommand from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';

export default class TopicCommand extends SafireCommand {
  constructor(context: PieceContext) {
    super(context, {
      name: 'topic',
      enabled: true,
      description: 'Set current stage channel to a new topic.',
      preconditions: ['GuildOnly', 'moderator-only'],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async run(message: Message, commandArguments: Args): Promise<SafireResult> {
    return commandArguments
      .rest('string')
      .then((topicString) =>
        !(message?.member?.voice.channel instanceof StageChannel)
          ? Promise.reject(new Error('No topic given.'))
          : message.member.voice.channel.setTopic(topicString),
      )
      .then((channel) =>
        !channel
          ? Promise.reject(new Error('Channel does not exist.'))
          : new SafireResult(`${channel.name}`),
      );
  }
}
