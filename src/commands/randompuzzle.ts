import {Message} from 'discord.js';
import {Utils} from '../utils/utils';
import {Command} from './command';

export class RandomPuzzle extends Command {
  getAliases(): string[] {
    return ['randompuzzle', 'RP'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    msg.reply('');
    msg.channel.send(Utils.getPuzzle());

    return true;
  }

  getHelp(): string {
    return 'Gives you a random puzzle to explore';
  }
}
