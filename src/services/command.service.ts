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
import {CronService} from './cron.service';
import {ClearChat} from '../utils/clearchat';
import {PollService} from './poll.service';
export namespace CommandService {
  function hasPermit(id: string): boolean {
    const permit: Bot.Permit = Bot.getPermit();
    return permit.permitted.includes(id);
  }

  export const dateRegex = new RegExp([
    '(\\d{1,4}) +(0\\d|1[0-2]) +(0\\d|[12]\\d|3[01]) +',
    '([01]\\d|2[0-3]) +([0-5]\\d)( +[0-5]\\d)?',
  ].join(''));
  // TODO: move API async message function to bot.ts
  export async function registerCommands() {
    Bot.api.on('message', async (msg) => {
      Utils.reactRedditor(msg);
      if (msg.author.bot) return; // bots
      if (!Bot.isProd && !hasPermit(msg.author.id)) return; // dev bot
      if (!msg.guild || !(msg.channel instanceof TextChannel)) {
        msg.reply('Commands are only allowed in server Text Channels');
      } else if (msg.content.substring(0, 2) === Bot.PREFIX) {
        if (msg.guild.id===process.env.GUILD) {
          parseCommand(msg);
        }
      } else {
        Utils.fInChat(msg);
      }
    });
  }

  // TODO: Use reply to make more clear replies to incorrect command usages
  async function parseCommand(msg: Message) {
    Logger.log(
      `${msg.author.tag} executed \`${msg.content}\``);
    Utils.Counter.addProcessed();
    // TODO: Improve regex to support single and double quotes.
    const args = msg.content.slice(2).split(/ +/);
    const cmd = args.shift().toLowerCase();

    switch (cmd) {
    case 'invite':
      msg.reply(Utils.inviteLink);
      break;
    case 'alive':
    case 'uptime':
      msg.react('👍');
      msg.reply('I have been active for ' + Utils.getUptime());
      break;
    case 'server':
      const count = msg.guild.memberCount;
      msg.reply(`The server currently has ${count} members`);
      break;
    case 'status':
    case 'info':
      msg.react('👍');
      msg.channel.send(Utils.getStatusEmbed());
      break;
    case 'version':
      msg.channel.send('The current version is ' +
        Utils.getVersion()).then((msg)=>msg.delete({timeout: 5000}));
      break;
    case 'jerome':
      msg.react('🤦‍♀️');
      msg.react('🤦‍♀️');
      msg.react('🤦‍♀️');
      msg.reply('"Ok boomer" ||from bruce||');
      msg.reply('http://jeromegambit.blogspot.com/');
      msg.reply('https://www.youtube.com/watch?v=N3AsRny3bpk');
      break;
    case 'randomopening':
      let url = 'https://www.365chess.com/eco/';
      url += Utils.getRandECO();
      msg.reply('Here\'s a random opening: \n' + url);
      break;
    case 'randompuzzle':
      msg.reply('');
      msg.channel.send(Utils.getPuzzle());
      break;
    case 'events':
      Utils.getEventsEmbed();
      break;
    case 'help':
      msg.react('👌');
      if (args[0] == 'quick') {
        msg.channel.send(Utils.getHelpEmbed()).then(
          (msg)=>msg.delete({timeout: 5000}),
        );
      } else {
        msg.reply('Read your DMs').then((msg)=>msg.delete({timeout: 3000}));
        Utils.sendDM(Utils.getHelpEmbed(), msg.author);
      }
      break;
    default:
      if (msg.channel instanceof DMChannel) {
        msg.channel.send('Certain commands are not supported in DM.');
        break;
      } else if (hasPermit(msg.author.id)) {
        switch (cmd) {
        case 'clear':
          msg.delete();
          if (args[0]=='all') {
            ClearChat.clearAll(msg.channel.id);
            if (args[1]!=='silent') {
              msg.channel.send('Cleared messages! Am I first?');
            }
          }
          break;
        case 'event':
          switch (args[0]) {
          case 'create':
          case 'remove':
          }
          break;
        case 'poll':
          if (args[0]=='create') {
            const cleanup: boolean = (args[1]=='cleanup');
            // channel is undefined if either args[1] is null or
            // if the text channel is not found
            let channel: string;
            if (cleanup) {
              msg.delete();
            } else if (args[1]) {
              if (args[1]=='here') {
                channel = msg.channel.id;
                msg.delete();
              } else if (Utils.textChannelExists(args[1])) {
                channel = args[1];
                msg.delete();
              } else {
                msg.reply('Text Channel was not found');
              }
            }
            PollService.createPollPrompt(msg, cleanup, channel);
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
            if (args[1]=='list') {
              // await const channels = Bot.api.channels.cache.
            } else {
              Utils.testChannel(process.env.ANN, 'Announcement');
              Utils.testChannel(process.env.OPEN, 'Daily Openings');
              Utils.testChannel(process.env.PUZZ, 'Puzzles');
              Utils.testChannel(process.env.LOG, 'Logging');
            }
          } else if (args[0]=='puzzle') {
            if (args[1]=='real') {
              Utils.postPuzzle();
            } else {
              Utils.postPuzzle(true);
            }
          } else if (args[0]=='opening') {
            Utils.postOpening();
          } else if (args[0]=='poll') {
            PollService.createPoll(msg, 'Test Poll',
              'This is the description of the poll. React to cast your vote.');
          } else if (args[0]=='reactions') {
            msg.reply('These are the default reactions.')
              .then((msg) => PollService.react(msg));
            msg.reply('').then(async (evt) => {
              const custom = await promptInput(
                'Enter a list of emojis to react with.', msg.channel,
                msg.author, 30000);
              PollService.react(evt, custom);
            });
          } else if (args[0]=='dm') {
            Utils.sendDM('This is a test DM', msg.author);
          }
          break;
        case 'restart':
        case 'reboot':
        case 'shutdown':
          msg.react('👍');
          msg.reply('Restarting now...');
          Logger.log('Shutting down');
          process.exit();
          // break;
        // TODO: DM feature
        case 'dm':
          break;
        case 'react':
          // TODO: custom emoji selector
          if (args.length >= 2) {
            const id = args[0];
            if (args[1]=='dandancool') { // DANDANCOOL
              Utils.getTextChannel(process.env.ANN).messages
                .fetch(id).then((message) => {
                  message.react('👍');
                  const danEmoji = Utils.findEmoji('dandancool');
                  if (danEmoji) {
                    message.react(danEmoji);
                  }
                  Utils.getTextChannel(process.env.ANN).send('Did it work?');
                });
            } else { // TODO: fix message not found
              msg.reply('Message not found...');
            }
          }
          break;
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
              CronService.sendReminder(content, msg.author);
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
              CronService.setReminder(dateObj, content, msg.author);
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
        // msg.delete({timeout: 2000});
        return;
      } else console.log('Permission denied from ID: ' + msg.author.id);
      msg.react('❌');
      msg.reply('Command not found');
    }
  }

  // TODO: prompt confirmation
  export async function promptConfirm(msg: string,
    channel: TextChannel | DMChannel | NewsChannel,
    user: User, cleanup: boolean = false): Promise<boolean> {
    const res = await promptInput('Please confirm ' + msg.toLowerCase() +
    ' (yes/no)', channel, user, 30000, cleanup);
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
    cleanup: boolean = false,
  ): Promise<string> {
    let input: string;
    await channel.send(question).then(async (evt) => {
      if (!timeLimit) timeLimit = 60000;
      const filter = (msg) => user.id === msg.author.id;
      await channel.awaitMessages(filter, {
        time: timeLimit, max: 1, errors: ['time'],
      }).then((messages) => {
        input = messages.first().content;
        if (cleanup) messages.first().delete({timeout: 1000});
        channel.send(
          `You've entered: ${input}`,
        ).then((msg) => {
          if (cleanup) msg.delete({timeout: 1000});
        });
      }) .catch(() => {
        channel.send('You did not enter any input!').then((msg) => {
          if (cleanup) msg.delete({timeout: 1000});
        });
      });
      if (cleanup) evt.delete({timeout: 1000});
    });
    return input;
  }
}
