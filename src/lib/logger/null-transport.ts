/* SPDX-License-Identifier: MIT OR CC0-1.0
Bryn (Safire Project) */

import Transport, { TransportStreamOptions } from 'winston-transport';

export default class NullTransport extends Transport {
  public constructor(options: Readonly<TransportStreamOptions>) {
    super(options);
  }

  public log(
    info: readonly unknown[],
    callback: { (transport: Readonly<NullTransport>): void },
  ): readonly unknown[] {
    callback(this);
    return info;
  }
}
