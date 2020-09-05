import {Message} from 'discord.js';
import {Utils} from '../utils/utils';
import {Command} from './command';

export class Invite extends Command {
  getAliases(): string[] {
    return ['invite'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    msg.reply(Utils.inviteLink);

    return true;
  }

  getHelp(): string {
    return 'Gives you a server invite link to share';
  }
}
