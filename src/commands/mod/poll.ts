import {Message} from 'discord.js';
import {PollService} from '../../services/poll.service';
import {Utils} from '../../utils/utils';
import {Command} from '../command';

export class Poll extends Command {
  needsPermit(): boolean {
    return true;
  }

  getAliases(): string[] {
    return ['poll', 'polls', 'P'];
  }

  async exec(msg: Message, args: string[]): Promise<boolean> {
    if (args[0]=='create') {
      const cleanup: boolean = (args[1]=='cleanup');
      // channel is undefined if either args[1] is null or
      // if the text channel is not found
      let channel: string;
      if (cleanup) {
        msg.delete();
      } else if (args[1]) {
        if (args[1]=='here') {
          channel = msg.channel.id;
          msg.delete();
        } else if (Utils.textChannelExists(args[1])) {
          channel = args[1];
          msg.delete();
        } else {
          msg.reply('Text Channel was not found');
        }
      }
      PollService.createPollPrompt(msg, cleanup, channel);
    } else {
      return false;
    }
    if (args[0]=='edit') {
      const cleanup: boolean = (args[1]=='cleanup');
      // channel is undefined if either args[1] is null or
      // if the text channel is not found
      let channel: string;
      if (cleanup) {
        msg.delete();
      } else if (args[1]) {
        if (args[1]=='here') {
          channel = msg.channel.id;
          msg.delete();
        } else if (Utils.textChannelExists(args[1])) {
          channel = args[1];
          msg.delete();
        } else {
          msg.reply('Text Channel was not found');
        }
      }
      PollService.editPoll(msg, cleanup, channel);
    }
    return true;
  }

  getHelp(): string {
    return 'Create a poll';
  }
}
