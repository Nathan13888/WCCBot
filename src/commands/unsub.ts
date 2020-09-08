import {Message} from 'discord.js';
import {Config} from '../config';
import {Roles} from '../services/roles.service';
import {Command} from './command';

export class Unsubcribe extends Command {
  getAliases(): string[] {
    return ['unsub', 'unsubscribe'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    const id = Config.ID.SUB;
    if (Roles.has(msg.member, id)) {
      msg.react('👍');
      Roles.remove(msg.member, id);
      msg.reply('You have *un*subscribed.');
    } else {
      msg.react('👎');
      msg.reply('You have **already** *un*subscribed.');
    }

    return true;
  }

  getHelp(): string {
    return 'Unsubscribes you to extra notifications';
  }
}
