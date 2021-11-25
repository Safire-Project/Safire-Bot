/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { Listener, PieceContext } from '@sapphire/framework';
import { TOPICS, EVENTS } from '../../lib/logger/index';

export default class NodeUnhandledRejectionLoggingEvent extends Listener<'unhandledRejection'> {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  constructor(context: PieceContext) {
    const options = {
      emitter: process,
      event: 'unhandledRejection',
    };
    super(context, options);
  }

  // eslint-disable-next-line functional/no-return-void
  public async run(error: Readonly<Error>): Promise<void> {
    return this.container.client.logger.warn(
      `[${error.name}] - [${error.message}] - [${error.stack ?? ''}]`,
      TOPICS.NODE,
      EVENTS.UNHANDLED_REJECTION,
    );
  }
}
