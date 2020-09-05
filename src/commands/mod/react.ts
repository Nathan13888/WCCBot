import {Message} from 'discord.js';
import {Utils} from '../../utils/utils';
import {Command} from '../command';

export class React extends Command {
  needsPermit(): boolean {
    return true;
  }

  getAliases(): string[] {
    return ['react'];
  }

  async exec(msg: Message, args: string[]): Promise<boolean> {
    // TODO: custom emoji selector
    if (args.length >= 2) {
      const id = args[0];
      if (args[1]=='dandancool') { // DANDANCOOL
        Utils.getTextChannel(process.env.ANN).messages
          .fetch(id).then((message) => {
            message.react('👍');
            const danEmoji = Utils.findEmoji('dandancool');
            if (danEmoji) {
              message.react(danEmoji);
            }
            Utils.getTextChannel(process.env.ANN).send('Did it work?');
          });
      } else { // TODO: fix message not found
        msg.reply('Message not found...');
      }
    }

    return true;
  }

  getHelp(): string {
    return 'Reacts to message';
  }
}