/* eslint-disable @typescript-eslint/no-unused-vars */
import {Message} from 'discord.js';
import {Utils} from '../utils/utils';
import {Command} from './command';

export class RandomOpening extends Command {
  getAliases(): string[] {
    return ['randomopening', 'RO'];
  }

  async exec(msg: Message, args: string[]): Promise<boolean> {
    let url = 'https://www.365chess.com/eco/';
    url += Utils.getRandECO();
    msg.reply('Here\'s a random opening: \n' + url);

    return true;
  }

  getHelp(): string {
    return 'Gives you a random opening to explore';
  }
}
