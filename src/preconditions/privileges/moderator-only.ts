/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Precondition, PreconditionResult } from '@sapphire/framework';
import { Message } from 'discord.js';

declare module '@sapphire/framework' {
  // eslint-disable-next-line functional/prefer-type-literal
  interface Preconditions {
    readonly ModeratorOnly: never;
  }
}

export default class ModeratorOnly extends Precondition {
  public run(message: Message): PreconditionResult {
    return !message.member
      ? this.error({
          message:
            'This command can only be used inside of guilds, and by guild moderators.',
        })
      : !message.member.roles.cache.some((role) => role.name === 'Moderator') &&
        message.member.manageable
      ? this.error({
          message: 'This command can only be used by server moderators.',
        })
      : this.ok();
  }
}
