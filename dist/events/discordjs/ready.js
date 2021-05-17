import { Event } from '@sapphire/framework';
export default class ReadyEvent extends Event {
    constructor(context) {
        super(context, {
            once: true,
        });
    }
    async run() {
        this.context.logger.info("The bot is working.");
    }
}
;
//# sourceMappingURL=ready.js.map