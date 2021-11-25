/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { stripIndents } from 'common-tags';
import { Listener, Events, PieceContext } from '@sapphire/framework';
import { Message } from 'discord.js';

export default class MessageTokenFilterEvent extends Listener<
  typeof Events.MessageCreate
> {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.MessageCreate,
    });
  }

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  async run(message: Message): Promise<Message | undefined | void> {
    const matches = /([\w-]+={0,2})(?:\.[\w-]+={0,2}){2}/.exec(message.content);
    return !matches ||
      BigInt(Buffer.from(matches[1] ? matches[1] : '', 'base64').toString()) ===
        0n
      ? undefined
      : message.channel
          .send(
            stripIndents`<@${message.author.id}>, the message you posted contained a bot token, you should reset it!
				> Go to <https://discordapp.com/developers/applications> and then click on the application that corresponds with your bot
				> Click "Bot" on the left side
				> Click the "Regenerate" button and then "Yes, do it!" on the popup.
				https://i.imgur.com/XtQsR9s.png`,
          )
          .then(() => (!message.deletable ? undefined : message.delete()))
          //TODO fp-ts this
          // eslint-disable-next-line functional/no-return-void
          .then((deletedMessage) =>
            !deletedMessage
              ? undefined
              : this.container.logger.fatal(
                  `${deletedMessage.author.tag} sent a token!`,
                ),
          );
  }
}
