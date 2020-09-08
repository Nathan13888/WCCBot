import {Message} from 'discord.js';
import {Utils} from '../utils/utils';
import {Command} from './command';

export class Uptime extends Command {
  getAliases(): string[] {
    return ['uptime', 'alive', 'ping', 'pong'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    msg.react('👍');
    msg.reply('I have been active for ' + Utils.getUptime());

    return true;
  }

  getHelp(): string {
    return 'Tells you how long the bot has been online';
  }
}
