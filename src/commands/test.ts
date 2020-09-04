import {Message} from 'discord.js';
import {Command} from './command';

export class Test extends Command {
  getHelp(): string {
    return 'This is a TEST help message';
  }

  exec(msg: Message, args: string[]) {
    msg.reply(`You inputted ${args.length} arguments in this command`);
    return true;
  }

  getAliases(): string[] {
    return ['test', 'test2', 'test2'];
  }
}
