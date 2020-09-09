import {Message} from 'discord.js';
import {CommandService} from '../services/command.service';
import {Command} from './command';

export class Lookup extends Command {
  getAliases(): string[] {
    return ['lookup'];
  }

  async exec(msg: Message, args: string[]): Promise<boolean> {
    if (args.length != 1) {
      return false;
    }
    // TODO: make this into an embed
    const query = CommandService.findCommand(args[0]);
    if (query) {
      // check permissions
      if (!query.needsPermit() || CommandService.hasPermit(msg.author.id)) {
        const aliases = '`'+query.getAliases().join('` | `')+'`';
        msg.reply(`**Alternate aliases**: ${aliases}`);
        msg.reply(`**HELP**: *${query.getHelp()}*`);
        return true;
      }
    }
    msg.reply('Command not found');

    return true;
  }

  getHelp(): string {
    return 'Looks up a command';
  }
}
