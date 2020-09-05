import {Message} from 'discord.js';
import {Utils} from '../utils/utils';
import {Command} from './command';

export class Version extends Command {
  getAliases(): string[] {
    return ['version'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    msg.channel.send('The current version is ' +
    Utils.getVersion()).then((msg)=>msg.delete({timeout: 5000}));

    return true;
  }

  getHelp(): string {
    return 'Tells you the current version of the bot';
  }
}
