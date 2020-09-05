import {Message} from 'discord.js';
import {Utils} from '../utils/utils';
import {Command} from './command';

export class Status extends Command {
  getAliases(): string[] {
    return ['status', 'stats', 'info'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    msg.react('👍');
    msg.channel.send(Utils.getStatusEmbed());

    return true;
  }

  getHelp(): string {
    return 'Tells you some useful information about the bot and server';
  }
}
