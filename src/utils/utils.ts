import {
  EmbedFieldData,
  Guild,
  Message,
  MessageAttachment,
  MessageEmbed,
  NewsChannel,
  TextChannel,
  User,
} from 'discord.js';
import {Bot} from '../bot';
import {Logger} from './logger';
import {DB} from '../services/db.service';
import {Config} from '../config';
import {Counter} from '../services/counter.service';
// import * as pack from '../../package.json';
export namespace Utils {
  export function reactRedditor(msg: Message): void {
    if (!Config.isProd) {
      return;
    }
    if (msg.author.id === Config.ID.REDDITOR) {
      const reactions: string[] = [
        '😆',
        '🤣',
        '😱',
        '😠',
        '🤔',
      ];
      for (const x of reactions) {
        try {
          msg.react(x);
        } catch (err) {
          Logger.err(err);
        }
      }
    }
  }
  export function fInChat(msg: Message): void {
    const cont = msg.content;
    const contL = cont.toLowerCase();
    // resembles `X in chat`
    if (cont.length > 80) {
      return;
    }
    const tokenized: string[] = contL.split(/ +/);
    for (let x = 0; x<tokenized.length; x++) {
      // msg.reply(`${x} -> ${tokenized[x]}`);
      if (tokenized[x].includes('in')) {
        // msg.reply('in');
        for (let y = x; y<tokenized.length; y++) {
          // msg.reply(`${y} -> ${tokenized[y]}`);
          if (tokenized[y].includes('chat')) {
            // msg.reply('chat');
            let word: string = '';
            for (let cur = contL.search('in')-1; cur>=0; cur--) {
              const char: string = cont.charAt(cur);
              const code: number = char.toLowerCase().charCodeAt(0);
              const lower = 'a'.charCodeAt(0);
              const upper = 'z'.charCodeAt(0);
              // msg.reply(char);
              // is letter
              if (lower <= code && code <= upper) {
                // msg.reply(`found ${char}`);
                word = char + word;
              }
              // if word isn't empty then...
              // stop if there is a space or
              // cursor is at the first letter of the message
              if (word.length!=0 && (char == ' '||cur == 0)) {
                if (word.length==1) {
                  msg.channel.send(word.toUpperCase());
                } else {
                  msg.channel.send(word);
                }
                return;
              }
            }
            return;
          }
        }
        return;
      }
    }
  }
  export function getRandECO(): string {
    let code: string = ''; const LETTERS = 'ABCDE';
    code += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
    const num = Math.floor(Math.random() * 99) + 1;
    if (num < 10) {
      code += '0';
    }
    code += num;
    return code;
  }
  export function findEmoji(x: string) {
    return Bot.api.emojis.cache.find((e) => e.name === x);
  }
  export function searchOpening() {

  }
  export function postPuzzle(test: boolean = false): void {
    const embed = getPuzzle('Daily Puzzle');
    Logger.log('Posting Puzzle');
    getTextChannel(Config.Channels.puzzles).send(embed).then((msg)=>{
      msg.react('👍');
      msg.react('❓');
      msg.react('👎');
      msg.react('😠');
      if (test) {
        msg.delete({timeout: 10000});
      }
    });
  }
  export function getPuzzle(title?: string): MessageEmbed {
    let t = 'Here is your random puzzle';
    if (title) {
      t = title;
    }
    const randnum : Number = Math.floor(Math.random() *
    Math.floor(125000));
    const thumbnail : string = 'https://lichess.org/training/export/gif/thumbnail/' +
   randnum + '.gif';
    const url: string = 'https://lichess.org/training/' + randnum;
    return new MessageEmbed()
      .setColor(Bot.primaryColour)
      .setTitle(t)
      .setDescription(url)
      .setImage(thumbnail)
      .setTimestamp()
      .setFooter(Bot.api.user.tag, Bot.api.user.displayAvatarURL());
  }
  export function postOpening(): void {
    let url = 'https://www.365chess.com/eco/';
    const code = getRandECO();
    const name = '';
    const desc = '';
    url += code;
    const logo = Bot.api.user.displayAvatarURL();

    const embed = new MessageEmbed().setColor(Bot.primaryColour)
      .setTitle('Daily Opening')
      .setURL(url)
      .setAuthor('WCCB', logo)
      .setDescription(desc)
      // .setThumbnail(logo)
      .addFields(
        {name: code + name, value: url},
        // { name: '\u200B', value: '\u200B' },
        // { name: 'Inline field title', value: 'Some value', inline: true },
      )
      .setTimestamp();

    getTextChannel(Config.Channels.puzzles).send(embed);
  }
  export function textChannelExists(id: string): boolean {
    const chan = Bot.api.channels.cache.get(id);
    if (!chan) {
      return false;
    }
    return chan.type == 'text';
  }
  export function getTextChannel(id: string): TextChannel | NewsChannel {
    const chan = Bot.api.channels.cache.get(id);
    if (!chan) {
      return undefined;
    }
    if (chan.type == 'text') {
      return (chan as TextChannel);
    } else if (chan.type == 'news') {
      return (chan as NewsChannel);
    } else return undefined;
  }
  export function getGuild(guild: string): Guild {
    return Bot.api.guilds.cache.get(guild);
  }
  // Sends message to channel
  // TODO: make `cb` parameter strict
  export function sendMessage(msg: string, id: string, cb: Function): void {
    const chan = getTextChannel(id);
    chan.send(msg).then((msg) => cb(msg));
  }
  export function sendDM(msg: string | MessageEmbed |
    MessageAttachment, user: User): void {
    try {
      user.send(msg);
    } catch {
      Logger.log('An ERROR occured when trying to send a message to '+user.tag);
    }
  }
  export function testChannel(id: string, name: string): void {
    const timeout: number = 5000;
    sendMessage('**TEST**: ' + name + ' Channel', id,
      (msg) => msg.delete({timeout}));
  }
  export function getStatusEmbed(): MessageEmbed {
    return new MessageEmbed()
      .setColor(Bot.primaryColour)
      .setTitle(`${Bot.api.user.tag} Status`)
      .setDescription('Version ' + Config.getVersion())
      .setThumbnail(Bot.api.user.displayAvatarURL())
      .addFields(
        {
          name: 'Commands Processed (since start/all time)',
          value: Counter.getProcessed() + '/' + Counter.getAlltime()},
        // {name: '\u200B', value: '\u200B'},
        {name: 'Restarts', value: Counter.getStarts(), inline: true},
        {name: 'Uptime', value: getUptime(), inline: true},
        {name: 'Guilds', value: Bot.api.guilds.cache.size, inline: true})
      .setTimestamp()
      .setFooter(Bot.api.user.tag, Bot.api.user.displayAvatarURL());
  }
  export async function getEventsEmbed(): Promise<MessageEmbed> {
    let data: EmbedFieldData[];
    for (const evt of await DB.Event.find()) {
      const e = (evt as DB.EventClass);
      if (!e.deleted) {
        data.push({
          name: e.title,
          value: e.date,
        });
      }
    }
    return new MessageEmbed()
      .setColor(Bot.primaryColour)
      .setTitle(`Events`)
      .setDescription('Upcoming Events...')
      .addFields(data)
      .setTimestamp()
      .setFooter(Bot.api.user.tag, Bot.api.user.displayAvatarURL());
  }
  export function getUptime(): string {
    let duration: number = Bot.api.uptime;
    const portions: string[] = [];
    const msInHour = 1000 * 60 * 60;
    const hours = Math.trunc(duration / msInHour);
    if (hours > 0) {
      portions.push(hours + 'h');
      duration = duration - (hours * msInHour);
    }
    const msInMinute = 1000 * 60;
    const minutes = Math.trunc(duration / msInMinute);
    if (minutes > 0) {
      portions.push(minutes + 'm');
      duration = duration - (minutes * msInMinute);
    }
    const seconds = Math.trunc(duration / 1000);
    if (seconds > 0) {
      portions.push(seconds + 's');
    }
    return portions.join(' ');
  }
}
