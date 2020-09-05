import {Message} from 'discord.js';
import {Utils} from '../utils/utils';
import {Command} from './command';

export class Events extends Command {
  getAliases(): string[] {
    return ['events'];
  }

  // TODO: finish events
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    msg.channel.send(Utils.getEventsEmbed());

    return true;
  }

  getHelp(): string {
    return 'WIP Gives you a list of current events';
  }
}
