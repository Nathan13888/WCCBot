import {Message} from 'discord.js';
import {Command} from './command';

export class Jerome extends Command {
  getAliases(): string[] {
    return ['jerome'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    msg.react('🤦‍♀️');
    msg.react('🤦‍♀️');
    msg.react('🤦‍♀️');
    msg.reply('"Ok boomer" ||from bruce||');
    msg.reply('http://jeromegambit.blogspot.com/');
    msg.reply('https://www.youtube.com/watch?v=N3AsRny3bpk');

    return true;
  }

  getHelp(): string {
    return 'Provides links to the Jerome Gambit';
  }
}
