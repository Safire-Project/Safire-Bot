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
      aliases: ['top', 'tp', 'stagetopic'],
      name: 'topic',
      description: 'Set current stage channel to a new topic.',
      detailedDescription:
        '`topic [phrase]`\n\n' +
        'To call the command, the user must be in a stage channel that is started. The stage will be set to the rest of the message that is sent to the bot minus the command. For example, a call of `?topic Safire Rocks!` will set the current stage channel\'s topic to "Safire Rocks!"',
      preconditions: ['GuildOnly', 'moderator-only'],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async run(message: Message, commandArguments: Args): Promise<SafireResult> {
    return commandArguments
      .rest('string')
      .then((topicString) =>
        !(message?.member?.voice.channel instanceof StageChannel)
          ? Promise.reject(
              new Error(
                'Not currently in a stage channel, join one and retry.',
              ),
            )
          : message.member.voice.channel.setTopic(topicString),
      )
      .then((channel) =>
        !channel
          ? Promise.reject(new Error('Channel does not exist.'))
          : new SafireResult(`${channel.name}`),
      );
  }
}
