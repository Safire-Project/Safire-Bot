/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import { PieceContext } from '@sapphire/framework';
import { MessageEmbed } from 'discord.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { right } from 'fp-ts/lib/Either';
import SafireCommand, { SafireEither } from '../../lib/types/safire-command';
import SafireResult from '../../lib/types/safire-result';

export default class ChartCommand extends SafireCommand {
  readonly chartJSNodeCanvas = new ChartJSNodeCanvas({
    width: 400,
    height: 400,
  });

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  constructor(context: PieceContext) {
    super(context, {
      aliases: ['ch'],
      description: 'Sends a test chart',
      detailedDescription: 'Sends a test chart from ChartJS as a MessageEmbed.',
      name: 'chart',
    });
  }

  async messageRun(): Promise<SafireEither> {
    return right(
      new SafireResult(
        `Test Chart`,
        {
          embeds: [
            new MessageEmbed()
              .setColor('RANDOM')
              .setTitle('Test Chart')
              .setDescription('Testing Chart.JS')
              .setImage('attachment://image.png'),
          ],
          files: [
            {
              name: 'image.png',
              attachment: this.chartJSNodeCanvas.renderToStream(
                {
                  type: 'line',
                  data: {
                    datasets: [
                      {
                        data: [0, 0],
                      },
                      {
                        data: [0, 1],
                      },
                      {
                        data: [1, 0],
                        showLine: true, // overrides the `line` dataset default
                      },
                      {
                        type: 'scatter', // 'line' dataset default does not affect this dataset since it's a 'scatter'
                        data: [1, 1],
                      },
                    ],
                  },
                },
                'image/png',
              ),
            },
          ],
        },
        { printResult: true, sendPayload: true },
      ),
    );
  }
}
