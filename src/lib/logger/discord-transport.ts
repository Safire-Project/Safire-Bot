/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { WebhookClient, MessageEmbed } from 'discord.js';
import { APIMessage } from 'discord-api-types/v8';
import os from 'os'; // eslint-disable-line unicorn/prefer-node-protocol
import Transport, { TransportStreamOptions } from 'winston-transport';
// eslint-disable-next-line node/no-unpublished-import

import { COLORS } from '../types/colors';

/**
 * Options for Discord transport for winston
 */
type DiscordTransportOptions = TransportStreamOptions & {
  readonly discord?: boolean;
  readonly webhookID: `${bigint}`;
  readonly webhookToken: string;
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
  private readonly webhook: WebhookClient | undefined;

  public constructor(options: DiscordTransportOptions) {
    super(options);
    this.webhook =
      options.discord === false
        ? undefined
        : new WebhookClient(options.webhookID, options.webhookToken);
  }

  /**
   * Winston function for logging messages
   * @param info - Log message from winston
   * @param callback - Callback to winston to complete the log
   */
  public async log(
    info: LoggerElements,
    // eslint-disable-next-line functional/no-return-void
    callback: () => void,
  ): Promise<void | APIMessage> {
    return !this.webhook
      ? callback()
      : this.webhook
          .send({
            embeds: [
              new MessageEmbed()
                .setTitle(info.level.toUpperCase())
                .setAuthor(info.label)
                .setDescription(info.message)
                .setColor(
                  DiscordTransport.colorCodes[info.level] ?? COLORS.DEFAULT,
                )
                .addField('Host', os.hostname()),
            ],
          })
          .finally(callback);
  }
}
