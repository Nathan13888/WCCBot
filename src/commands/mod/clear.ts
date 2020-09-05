import {Message} from 'discord.js';
import {ClearChat} from '../../utils/clearchat';
import {Command} from '../command';

export class Clear extends Command {
  needsPermit(): boolean {
    return true;
  }

  getAliases(): string[] {
    return ['clear'];
  }

  async exec(msg: Message, args: string[]): Promise<boolean> {
    msg.delete();
    if (args[0]=='all') {
      ClearChat.clearAll(msg.channel.id);
      if (args[1]!=='silent') {
        msg.channel.send('Cleared messages! Am I first?');
      }
    }

    return true;
  }

  getHelp(): string {
    return 'CLEARS chat';
  }
}
