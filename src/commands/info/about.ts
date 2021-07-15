/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { PieceContext } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';
import SafireCommand from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';

export default class AboutCommand extends SafireCommand {
  constructor(context: PieceContext) {
    const options = {
      name: 'about',
      description: 'Sends details about Safire.',
      enabled: false,
    };
    super(context, options);
  }

  async run(): Promise<SafireResult> {
    return new SafireResult(
      'Printed Safire Details',
      new MessageEmbed().setAuthor(this.container.client.user?.tag ?? 'Safire'),
      {
        printResult: true,
        sendEmbed: true,
      },
    );
  }
}
