/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Listener, Events, PieceContext } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { match } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { SafireCommandSuccessPayload } from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';

export default class CommandFeedbackEvent extends Listener<
  typeof Events.CommandSuccess
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.CommandSuccess,
    };
    super(context, options);
  }

  // eslint-disable-next-line functional/no-return-void
  public run({
    command,
    message,
    result,
  }: SafireCommandSuccessPayload): Promise<Message<boolean> | undefined> {
    return pipe(
      result,
      match(
        (error: Error) =>
          message.reply({
            embeds: [
              new MessageEmbed()
                .setColor('DARK_RED')
                .setDescription(error.message)
                .setFooter(`from ${command.name}`),
            ],
          }),
        (safireResult: SafireResult) =>
          (safireResult.options.sendPayload
            ? message.reply(safireResult.payload)
            : new Promise(() => {})
          ).then(() =>
            safireResult.options.printResult
              ? message.reply(safireResult.message)
              : new Promise(() => {}),
          ),
      ),
    );
  }
}
