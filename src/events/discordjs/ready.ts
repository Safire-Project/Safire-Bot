import { Event, PieceContext } from '@sapphire/framework';

export default class ReadyEvent extends Event {
  constructor (context: PieceContext) {
    super(context, {
      once: true,
    });
  }

  async run() {
    this.context.logger.info("The bot is working.");
  }
};
