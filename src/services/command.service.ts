// eslint-disable-next-line no-unused-vars
import * as Discord from 'discord.js';
import {Logger} from '../utils/logger';
export class CommandService {
    parseCommand(msg: Discord.Message) {
        Logger.log(
            `${msg.author.tag} (COMMAND): ${msg.content}`);
        const cmd = msg.content.substring(2).toLowerCase();
        const args = cmd.split(' ');
        switch (args[0]) {
        case 'ping':
            msg.reply('pong');
            break;
        case 'announce':
            const embed = new Discord.MessageEmbed()
                .setAuthor(msg.author.tag)
                .setColor(0xd62320)
                .setTitle('A slick little embed')
                .setDescription('Hello, this is a slick embed!')
                .setFooter('Footer', msg.author.avatarURL());
            msg.channel.send(embed);
            break;
        default:
            msg.reply('Invalid command. Please specify a command.');
        }
    }
}
