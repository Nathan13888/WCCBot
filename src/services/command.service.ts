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

    export async function parseCommand(msg: Discord.Message) {
        Logger.log(
            `${msg.author.tag} executed '${msg.content}'`);
        // TODO: Improve regex to support single and double quotes.
        const args = msg.content.slice(2).split(/ +/);
        const cmd = args.shift().toLowerCase();

        // TODO: check if user has permission
        switch (cmd) {
            case 'alive':
                msg.react('👍');
                break;
            case 'help':
                // msg.react(':regional_indicator_w:');
                // msg.react(':regional_indicator_i:');
                // msg.react(':regional_indicator_p:');
                msg.channel.send('W.I.P');
                break;
            case 'shutdown':
                Logger.log('Shutting down');
                process.exit();
                break;
            case 'announce':
                const title = await promptInput(
                    'Please tell me the title.',
                    msg.channel, msg.author);
                if (!title) {
                    msg.channel.send('Timed out. Please try again.');
                    break;
                }
                const message = await promptInput(
                    'Please tell me the message.',
                    msg.channel, msg.author, 120000);
                if (!message) {
                    msg.channel.send('Timed out. Please try again.');
                    break;
                }
                msg.channel.send(new Discord.MessageEmbed()
                    // .setAuthor()
                    .setColor(0xd62320)
                    .setTitle(title)
                    .setDescription(message)
                    .setFooter(msg.author.tag, msg.author.avatarURL()),
                );
                break;
            default:
                if (msg.member.roles.cache.some(
                    (role) => role.name.toLowerCase().startsWith('bot'),
                )/* ||msg.channel.id*/) {
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

    async function promptInput(
        question: string,
        channel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel,
        user: Discord.User,
        timeLimit?: number,
    ) {
        let input: string | undefined;
        await channel.send(question).then(async () => {
            if (!timeLimit) timeLimit = 60000;
            const filter = (msg) => user.id === msg.author.id;
            await channel.awaitMessages(filter, {
                time: timeLimit, max: 1, errors: ['time'],
            })
                .then((messages) => {
                    input = messages.first().content;
                    channel.send(
                        `You've entered: ${input}`,
                    );
                })
                .catch(() => {
                    channel.send('You did not enter any input!');
                });
        });
        return input;
    }
}
