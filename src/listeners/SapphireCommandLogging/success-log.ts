/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Listener, Events, PieceContext } from '@sapphire/framework';

import { match } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { TOPICS, EVENTS } from '../../lib/logger/index';
import { SafireCommandSuccessPayload } from '../../lib/types/safire-command';
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
  }: SafireCommandSuccessPayload): Promise<void> {
    return pipe(
      result,
      match(
        async (error: Error) =>
          this.container.logger.error(
            `Command: [${command.name}] - Message: [${
              message.content
            }] - String Args: [${
              (await args.repeatResult('string')).value?.toString() ?? ''
            }] - Command Prefix: [${
              context.commandPrefix
            }] - Parameters: [${parameters.toString()}] - User Error: [${
              error.message
            }]`,
            TOPICS.SAPPHIRE,
            EVENTS.COMMAND_ERROR,
          ),
        async (safireResult: SafireResult) =>
          this.container.logger.info(
            `Command: [${command.name}] - Message: [${
              message.content
            }] - String Args: [${
              (await args.repeatResult('string')).value?.toString() ?? ''
            }] - Command Prefix: [${
              context.commandPrefix
            }] - Parameters: [${parameters.toString()}] - Result: [${
              safireResult.message
            }]`,
            TOPICS.SAPPHIRE,
            EVENTS.COMMAND_SUCCESS,
          ),
      ),
    );
  }
}
