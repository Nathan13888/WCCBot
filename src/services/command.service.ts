// eslint-disable-next-line no-unused-vars
import * as Discord from 'discord.js';
import {Logger} from '../utils/logger';
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
            msg.react('👍');
            break;
        case 'shutdown':
            Logger.log('Shutting down');
            process.exit();
            break;
        case 'announce':
            const title = 'Lorum Ipsum';
            const message = 'lorum ipsum';
            const embed = new Discord.MessageEmbed()
                // .setAuthor()
                .setColor(0xd62320)
                .setTitle(title)
                .setDescription(message)
                .setFooter(msg.author.tag, msg.author.avatarURL());
            msg.channel.send(embed);
            break;
        default:
            msg.channel.send('Command not found');
        }
    }
}
