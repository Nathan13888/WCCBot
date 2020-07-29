import {
  APIMessage, DMChannel,
  Message, MessageAdditions, MessageEmbed,
  MessageOptions, NewsChannel,

  StringResolvable, TextChannel,
  User,
  GuildMember,
} from 'discord.js';
import {Bot} from '../bot';
import {Logger} from '../utils/logger';
import {Utils} from '../utils/utils';
import {ReminderService} from './reminder.service';
import {ClearChat} from '../utils/clearchat';
import {PollService} from './poll.service';
export namespace CommandService {
  export const dateRegex = new RegExp([
    '(\\d{1,4}) +(0\\d|1[0-2]) +(0\\d|[12]\\d|3[01]) +',
    '([01]\\d|2[0-3]) +([0-5]\\d)( +[0-5]\\d)?',
  ].join(''));
  export async function registerCommands() {
    Bot.api.on('message', async (msg) => {
      if (msg.author.bot) return;
      if (msg.content.substring(0, 2) === '::') {
        parseCommand(msg);
      }
    });
  }

  // TODO: Use reply to make more clear replies to incorrect command usages
  async function parseCommand(msg: Message) {
    Logger.log(
      `${msg.author.tag} executed \`${msg.content}\``);
    // TODO: Improve regex to support single and double quotes.
    const args = msg.content.slice(2).split(/ +/);
    const cmd = args.shift().toLowerCase();

    for (let i = 0; i<args.length; i++) {
      args[i]=args[i].toLowerCase();
    }

    const permit: Bot.Permit = Bot.getPermit();


    switch (cmd) {
    case 'alive':
      msg.react('👍');
      break;
    case 'version':
      msg.channel.send('The current version is ' +
        Utils.getVersion()).then((msg)=>msg.delete({timeout: 5000}));
      break;
    case 'randomopening':
      let url = 'https://www.365chess.com/eco/';
      url += Utils.getRandECO();
      msg.reply('Here\'s a random opening: \n' + url);
      break;
    case 'help':
      msg.react('👎');
      msg.react('🇼');
      msg.react('🇮');
      msg.react('🇵');
      break;
    default:
      if (msg.channel instanceof DMChannel) {
        msg.channel.send('Certain commands are not supported in DM.');
        break;
      } else if (permit.permitted.includes(msg.author.id)) {
        switch (cmd) {
        case 'clear':
          msg.delete();
          if (args[0]=='all') {
            ClearChat.clearAll(msg.channel.id);
            msg.channel.send('Cleared messages! Am I first?');
          }
          break;
        case 'poll':
          if (args[0]=='create') {
            PollService.createPollPrompt(msg);
          }
          break;
        case 'checkroles':
          msg.reply('Checking roles...');
          const changed: Array<GuildMember> =
              Utils.checkMinRole(msg.guild.id);
          changed.forEach((member) => {
            const s = `${member.user.tag} has been given the default role`;
            msg.reply(s);
            Logger.log('[Check Roles] ' + s);
          });
          msg.reply('Done.');
          break;
        case 'test':
          if (args[0]=='channels') {
            Utils.testChannel(process.env.ANN, 'Announcement');
            Utils.testChannel(process.env.OPEN, 'Daily Openings');
            Utils.testChannel(process.env.PUZZ, 'Puzzles');
            Utils.testChannel(process.env.LOG, 'Logging');
          } else if (args[0]=='opening') {
            Utils.postOpening();
          } else if (args[0]=='poll') {
            PollService.createPoll(msg, 'Test Poll',
              'This is the description of the poll. React to cast your vote.');
          }
          break;
        case 'shutdown':
          Logger.log('Shutting down');
          process.exit();
          // break;
        case 'remind':
          if (args && args.length) {
            if (args.length > 1) {
              msg.channel.send('Too many arguments!');
              return;
            }
            if (args[0].toLowerCase() === 'now') {
              const content = await promptInput(
                'What is the message of the reminder?',
                msg.channel, msg.author);
              if (!content) {
                msg.channel.send('Timed out. Please try again.');
                return;
              }
              ReminderService.sendReminder(content, msg.author);
            } else {
              msg.channel.send('Invalid time argument.');
            }
          } else {
            const content = await promptInput(
              'What is the message of the reminder?',
              msg.channel, msg.author);
            if (!content) {
              msg.channel.send('Timed out. Please try again.');
              return;
            }
            const date = await promptInput(
              'Enter the date (YYYY MM DD hh mm ss)',
              msg.channel, msg.author);
            if (!date) {
              msg.channel.send('Timed out. Please try again.');
              return;
            }
            const match = dateRegex.exec(date);
            if (match) {
              const dateObj = new Date(
                parseInt(match[1]),
                parseInt(match[2]) - 1,
                parseInt(match[3]),
                parseInt(match[4]),
                parseInt(match[5]),
                match[6] ? parseInt(match[6]) : 0,
              );
              ReminderService.setReminder(dateObj, content, msg.author);
              msg.channel.send('Reminder is set.');
            } else {
              msg.channel.send('Invalid date format.');
              return;
            }
          }
          break;
        case 'announce':
          const title = await promptInput(
            'Please tell me the title.',
            msg.channel, msg.author);
          if (!title) {
            msg.channel.send('Timed out. Please try again.');
            return;
          }
          const message = await promptInput(
            'Please tell me the message.',
            msg.channel, msg.author, 120000);
          if (!message) {
            msg.channel.send('Timed out. Please try again.');
            return;
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
          if (!(confirmation && confirmation.toLowerCase() === 'yes')) {
            msg.channel.send(
              'Your announcement has been cancelled.',
            );
            break;
          }
          Bot.announcementChannel.send(embed);
          break;
        default:
          msg.react('❌');
        }
        msg.delete({timeout: 2000});
        return;
      } else console.log('Permission denied from ID: ' + msg.author.id);
      msg.react('❌');
      msg.reply('Command not found');
    }
  }

  // TODO: prompt confirmation
  export async function promptConfirm(msg: string,
    channel: TextChannel | DMChannel | NewsChannel,
    user: User): Promise<boolean> {
    const res = await promptInput('Please confirm ' + msg.toLowerCase() +
    ' (yes/no)', channel, user, 30000);
    return (res && res.toLowerCase() === 'yes' ? true : false);
  }

  // TODO: auto timeout message
  export async function promptInput(
    question: StringResolvable | MessageOptions
      | (MessageOptions & { split?: false })
      | MessageAdditions | APIMessage,
    channel: TextChannel | DMChannel | NewsChannel,
    user: User,
    timeLimit?: number,
  ): Promise<string> {
    let input: string;
    await user.lastMessage.reply(question).then(async () => {
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
