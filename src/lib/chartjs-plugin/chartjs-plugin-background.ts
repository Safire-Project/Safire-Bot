/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

// Rewrite of https://github.com/acailly/chartjs-plugin-background under the DWTFYWT Public License

import { Chart, Plugin } from 'chart.js';
import { AnyObject } from 'chart.js/types/basic';

declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, functional/prefer-type-literal
  interface PluginOptionsByType<TType extends ChartType> {
    readonly background?: { readonly chartBackgroundColor: string };
  }
}

export const backgroundPlugin: Plugin = {
  id: 'background',
  beforeDraw: function (
    chart,
    _arguments,
    options: AnyObject & { readonly chartBackgroundColor: string },
  ) {
    const { chartBackgroundColor }: { readonly chartBackgroundColor: string } =
      options;

    // eslint-disable-next-line functional/no-conditional-statement
    if (chartBackgroundColor) {
      const context = chart.ctx;
      const canvas = chart.canvas;

      // eslint-disable-next-line functional/immutable-data, functional/no-expression-statement
      context.fillStyle = chartBackgroundColor;
      // eslint-disable-next-line functional/no-expression-statement
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  },
};
// eslint-disable-next-line functional/no-expression-statement
Chart.register(backgroundPlugin);
