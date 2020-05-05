// eslint-disable-next-line no-unused-vars
import * as Discord from 'discord.js';
import { Logger } from '../utils/logger';
export class CommandService {
    parseCommand(msg: Discord.Message) {
        Logger.log(
            `${msg.author.tag} executed '${msg.content}'`);
        const cmd = msg.content.substring(2).toLowerCase();
        const args = cmd.split(/ +/);

        switch (args[0]) { }

        // TODO: check if user has permission
        switch (args[0]) {
            case 'alive':
                let timeout = 3000;
                msg.react('👍');
                break;
            case 'announce':
                Logger.log('Announcing...');
                // TODO: FINISH
                break;
            case 'shutdown':
                Logger.log('Restarting Bot.');
                process.exit();
                break;
            default:
                msg.channel.send('Command not found');
        }
    }
}
