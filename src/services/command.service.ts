import * as Discord from 'discord.js';
import { Logger } from '../utils/logger';
export class CommandService {
    parseCommand(msg: Discord.Message) {
        const cmd = msg.content.substring(2).toLowerCase();
        const args = cmd.split(' ');

        switch (args[0]) {
            case 'ping':
                msg.reply("pong");
            case 'announce':
                Logger.log('Announcing...');
                // TODO: FINISH
                break;

            default:
                msg.author.send('Invalid command. Please specify a command.');
        }
    }
}
