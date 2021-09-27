/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import {
  CommandSuccessPayload,
  Listener,
  Events,
  PieceContext,
} from '@sapphire/framework';

import { TOPICS, EVENTS } from '../../lib/logger/index';
import SafireResult from '../../lib/types/safire-result';

export default class CommandSuccessLoggingEvent extends Listener<
  typeof Events.CommandSuccess
> {
  constructor(context: PieceContext) {
    const options = {
      event: Events.CommandSuccess,
    };
    super(context, options);
  }

  // eslint-disable-next-line functional/no-return-void
  public async run({
    args,
    command,
    context,
    message,
    parameters,
    result,
  }: CommandSuccessPayload): Promise<void> {
    return this.container.logger.info(
      `Command: [${command.name}] - Message: [${
        message.content
      }] - String Args: [${
        (await args.repeatResult('string')).value?.toString() ?? ''
      }] - Command Prefix: [${
        context.commandPrefix
      }] - Parameters: [${parameters.toString()}] - Result: [${
        typeof result !== 'string'
          ? !(result instanceof SafireResult)
            ? ''
            : result.message
          : result
      }]`,
      TOPICS.SAPPHIRE,
      EVENTS.COMMAND_SUCCESS,
    );
  }
}
