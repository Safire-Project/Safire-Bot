import { Command } from '@sapphire/framework';
export default class PingCommand extends Command {
    constructor(context) {
        super(context, {
            name: 'ping',
            description: 'Send back the ping of the bot',
        });
    }
    async run(message) {
        const msg = await message.channel.send('Ping?');
        return msg.edit(`Pong! Bot Latency ${Math.round(this.context.client.ws.ping)}ms. API Latency ${msg.createdTimestamp - message.createdTimestamp}ms.`);
    }
}
;
//# sourceMappingURL=ping.js.map