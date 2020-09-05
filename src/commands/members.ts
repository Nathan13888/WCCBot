import {Message} from 'discord.js';
import {Command} from './command';

export class Members extends Command {
  getAliases(): string[] {
    return ['members', 'server'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    const count = msg.guild.memberCount;
    msg.reply(`The server currently has ${count} members`);

    return true;
  }

  getHelp(): string {
    return 'Tells you the number of members the server has';
  }
}
