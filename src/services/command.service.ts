import {TextChannel, DMChannel, NewsChannel,
    Message, MessageEmbed, User, MessageAdditions,
    APIMessage, StringResolvable, MessageOptions} from 'discord.js';
import {Bot} from '../bot';
import {Logger} from '../utils/logger';
export namespace CommandService {
    export async function registerCommands() {
        Bot.api.on('message', async (msg) => {
            if (msg.author.bot) return;
            if (msg.content.substring(0, 2) === 'w!') {
                parseCommand(msg);
            }
        });
    }

    async function parseCommand(msg: Message) {
        Logger.log(
            `${msg.author.tag} executed '${msg.content}'`);
        // TODO: Improve regex to support single and double quotes.
        const args = msg.content.slice(2).split(/ +/);
        const cmd = args.shift().toLowerCase();

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
                    const embed = new MessageEmbed()
                    // .setAuthor()
                        .setColor(0xd62320)
                        .setTitle(title)
                        .setDescription(message)
                        .setFooter(msg.author.tag, msg.author.avatarURL());

                    const confirmation = await promptInput(
                        'Please confirm the announcement. (Yes/no)',
                        msg.channel, msg.author, 30000);
                    if (!(confirmation && confirmation.toLowerCase()==='yes')) {
                        msg.channel.send(
                            'Your announcement has been cancelled.',
                        );
                        break;
                    }
                    Bot.announcementChannel.send(embed);
                    break;
                }
            } else {
                msg.channel.send('Command not found');
            }
        }
    }

    async function promptInput(
        question: StringResolvable | MessageOptions
            | (MessageOptions & { split?: false })
            | MessageAdditions | APIMessage,
        channel: TextChannel | DMChannel | NewsChannel,
        user: User,
        timeLimit?: number,
    ) {
        let input: string;
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
