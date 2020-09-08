import {Message} from 'discord.js';
import {Config} from '../config';
import {Roles} from '../services/roles.service';
import {Command} from './command';

export class Subscribe extends Command {
  getAliases(): string[] {
    return ['sub', 'subscribe'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    const id = Config.ID.SUB;
    if (Roles.has(msg.member, id)) {
      msg.react('👎');
      msg.reply('You have **already** subscribed.');
    } else {
      msg.react('👍');
      Roles.add(msg.member, id);
      msg.reply('You have subscribed.');
    }

    return true;
  }

  getHelp(): string {
    return 'Subscribes you to extra notifications';
  }
}
