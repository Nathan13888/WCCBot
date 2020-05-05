import * as Discord from 'discord.js';
import { Logger } from '../utils/logger';
export class CommandService {
    parseCommand(msg: Discord.Message) {
        const cmd = msg.content.substring(2);
        const args = cmd.split(' ');
        args[0] = args[0].toLowerCase();
        if(args[0]==='announce') {
            Logger.log('Announcing...');
            // TODO: FINISH
        } else {
            msg.author.send('Invalid command. Please specify a command.');
        }
    }
}
