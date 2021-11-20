/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

// eslint-disable-next-line node/no-missing-import
import os from 'node:os';
import Transport, { TransportStreamOptions } from 'winston-transport';
import { Webhook, MessageBuilder } from 'webhook-discord';
import { COLORS } from '../types/colors';

/**
 * Options for Discord transport for winston
 */
type DiscordTransportOptions = TransportStreamOptions & {
  readonly discord?: boolean;
  readonly webhookUrl: string;
};

type LoggerElements = Record<string, unknown> & {
  readonly error: string;
  readonly event: string;
  readonly label: string;
  readonly level: string;
  readonly message: string;
  readonly timestamp: string;
  readonly topic: string;
};

export default class DiscordTransport extends Transport {
  /** Available colors for discord messages */
  private static readonly colorCodes: { readonly [key: string]: number } = {
    error: COLORS.DARK_RED,
    warn: COLORS.RED,
    help: COLORS.DARK_ORANGE,
    data: COLORS.YELLOW,
    info: COLORS.DARK_GREEN,
    debug: COLORS.GREEN,
    prompt: COLORS.DARK_BLUE,
    verbose: COLORS.DARK_BLUE,
    input: COLORS.DARK_PURPLE,
    silly: COLORS.PURPLE,
  };

  /** Webhook obtained from Discord */
  private readonly webhook: Webhook;

  public constructor(options: DiscordTransportOptions) {
    super(options);
    this.webhook = new Webhook(options.webhookUrl);
  }

  /**
   * Winston function for logging messages
   * @param info - Log message from winston
   * @param callback - Callback to winston to complete the log
   */
  public log(
    info: LoggerElements,
    // eslint-disable-next-line functional/no-return-void
    callback: () => void,
    // eslint-disable-next-line functional/no-return-void
  ): void {
    void this.webhook
      .send(
        new MessageBuilder()
          .setName('Safire')
          .setTitle(info.level.toUpperCase())
          .setAuthor(info.label)
          .setDescription(info.message ?? '')
          .setColor(
            `#${(
              DiscordTransport.colorCodes[info.level] ?? COLORS.DEFAULT
            ).toString(16)}`,
          )
          .addField('Host', os.hostname()),
      )
      .catch((error) => console.error(error));
    return callback();
  }
}
