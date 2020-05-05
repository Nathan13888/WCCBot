// eslint-disable-next-line no-unused-vars
import * as Discord from 'discord.js';
import { Logger } from '../utils/logger';
export class CommandService {
    parseCommand(msg: Discord.Message) {
        Logger.log(
            `${msg.author.username}#${msg.author.discriminator}
            (COMMAND): ${msg.content}`);
        const cmd = msg.content.substring(2).toLowerCase();
        const args = cmd.split(/ +/);

        switch (args[0]) { }

        // TODO: check if user has permission
        switch (args[0]) {
            case 'ping':
                msg.reply("pong");
                break;
            case 'announce':
                Logger.log('Announcing...');
                // TODO: FINISH
                break;
            case 'restart':
                Logger.log('Restarting Bot.');
                msg.client.destroy();
                msg.client.
                break;
            default:
                msg.author.send('Invalid command. Please specify a command.');
        }
    }
}
