// eslint-disable-next-line no-unused-vars
import * as Discord from 'discord.js';
import { Bot } from '../bot';
import { Logger } from '../utils/logger';
export namespace CommandService {
    export function registerCommands() {
        Bot.api.on('message', async (msg) => {
            if (msg.author.bot) return;
            if (msg.content.substring(0, 2) == 'w!') {
                parseCommand(msg);
            }
        });
    }

    export function parseCommand(msg: Discord.Message) {
        Logger.log(
            `${msg.author.tag} executed '${msg.content}'`);
        // const args = msg.content.slice(2).split(/\s+/);
        // const cmd = args.shift().toLowerCase();
        // console.log(cmd);
        // console.log(args);
        const cmd = msg.content.substring(2).toLowerCase();
        const args = cmd.split(/ +/);

        switch (args[0]) {
            case 'alive':
                msg.react('👍');
                break;
            case 'help':
                // msg.react(':regional_indicator_w:');
                // msg.react(':regional_indicator_i:');
                // msg.react(':regional_indicator_p:');
                msg.channel.send("W.I.P");
                break;
            default:
                if (msg.member.roles.cache.some(role => role.name.toLowerCase().startsWith("bot"))/*||msg.channel.id*/)
                    switch (cmd) {
                        case 'shutdown':
                            Logger.log('Shutting down');
                            process.exit();
                            break;
                        case 'announce':
                            if (args.length !== 2) {
                                msg.channel.send('Invalid number of arguments.');
                                break;
                            }
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
}
