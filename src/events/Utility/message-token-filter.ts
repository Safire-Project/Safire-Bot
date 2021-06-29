/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { stripIndents } from 'common-tags';
import { Event, Events, PieceContext } from '@sapphire/framework';
import { Message } from 'discord.js';

export default class MessageTokenFilterEvent extends Event<Events.Message> {
  constructor(context: PieceContext) {
    super(context, {
      once: true,
      event: Events.Message,
    });
  }

  async run(message: Message): Promise<Message | undefined | void> {
    const matches = /([\w-]+={0,2})\.([\w-]+={0,2})\.([\w-]+={0,2})/g.exec(
      message.content,
    );
    return !matches ||
      // eslint-disable-next-line total-functions/no-unsafe-readonly-mutable-assignment
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
          .then((deletedMessage) =>
            !deletedMessage
              ? undefined
              : this.container.logger.fatal(
                  `${deletedMessage.author.tag} sent a token!`,
                ),
          );
  }
}
