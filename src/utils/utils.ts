import {MessageEmbed, TextChannel, GuildMember, Role, Guild} from 'discord.js';
import {Bot} from '../bot';
import {Logger} from './logger';
import countapi from 'countapi-js';
// import * as pack from '../../package.json';
export namespace Utils {
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
  export function searchOpening() {

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

    getTextChannel(process.env.OPEN).send(embed);
  }
  export function getTextChannel(id: string): TextChannel {
    const chan = Bot.api.channels.cache.get(id);
    if (chan.type == 'text') {
      return (chan as TextChannel);
    } else return undefined;
  }
  export function getGuild(guild: string): Guild {
    return Bot.api.guilds.cache.get(guild);
  }
  export function getRole(guild: string, roleID: string): Role {
    return getGuild(guild).roles.cache.get(roleID);
  }
  // Sends message to channel
  // TODO: make `cb` parameter strict
  export function sendMessage(msg: string, id: string, cb: Function): void {
    const chan = getTextChannel(id);
    chan.send(msg).then((msg) => cb(msg));
  }
  export function testChannel(id: string, name: string): void {
    const timeout: number = 5000;
    sendMessage('**TEST**: ' + name + ' Channel', id,
      (msg) => msg.delete({timeout}));
  }
  export function checkMinRole(guild: string): Array<GuildMember> {
    const changed: Array<GuildMember> = [];
    getGuild(guild).members.cache.forEach((member) => {
      // filter bots
      if (!member.user.bot) {
        if (!member.roles.cache.some((role) => role.id===process.env.DEFROLE)) {
          const role = getRole(guild, process.env.DEFROLE);
          member.roles.add(role);
          changed.push(member);
        }
      }
    });
    return changed;
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
  const version = require('../../package.json').version;
  export function getVersion(): string {
    return version;
  }
  export namespace Counter {
    const namespace = 'wccbot1';
    export function init(): void {
      addStarts();
      Logger.log(`Total Restarts: ${getStarts()}`);
      Logger.log(`Total Commands Processed: ${getAlltime()}`);
    }
    export function addStarts(): void {
      countapi.update(namespace, 'starts', 1);
    }
    export async function getStarts(): Promise<number> {
      return await (countapi.get(namespace, 'starts')).value;
    }
    let count = 0;
    export function addProcessed(): void {
      count++;
      countapi.update(namespace, 'commands', 1);
    }
    export function getProcessed(): number {
      return count;
    }
    export async function getAlltime(): Promise<number> {
      return countapi.get(namespace, 'commands').value;
    }
  }
}
