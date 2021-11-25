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
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  constructor(context: PieceContext) {
    const options = {
      event: Events.CommandSuccess,
    };
    super(context, options);
  }

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  public async run({
    args,
    command,
    context,
    message,
    parameters,
    result,
  }: SafireCommandSuccessPayload): Promise<void> {
    return args
      .repeatResult('string')
      .then(
        (resultString) =>
          `Command: [${command.name}] - Message: [${
            message.content
          }] - String Args: [${
            resultString.value?.toString() ?? ''
          }] - Command Prefix: [${
            context.commandPrefix
          }] - Parameters: [${parameters.toString()}]`,
      )
      .then((reportString) =>
        pipe(
          result,
          match(
            async (error: Readonly<Error>) =>
              this.container.logger.error(
                `${reportString} - User Error: [${error.message}]`,
                TOPICS.SAPPHIRE,
                EVENTS.COMMAND_ERROR,
              ),
            async (safireResult: SafireResult) =>
              this.container.logger.info(
                `${reportString} - Result: [${safireResult.message}]`,
                TOPICS.SAPPHIRE,
                EVENTS.COMMAND_SUCCESS,
              ),
          ),
        ),
      );
  }
}
