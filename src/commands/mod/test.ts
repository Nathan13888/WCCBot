import {Message} from 'discord.js';
import {PollService} from '../../services/poll.service';
import {Prompt} from '../../services/prompt.service';
import {Utils} from '../../utils/utils';
import {Command} from '../command';

export class Test extends Command {
  needsPermit(): boolean {
    return true;
  }

  getAliases(): string[] {
    return ['test', 'test2', 'test2'];
  }

  async exec(msg: Message, args: string[]): Promise<boolean> {
    // msg.reply(`You inputted ${args.length} arguments in this command`);

    if (args[0]=='channels') {
      if (args[1]=='list') {
        // await const channels = Bot.api.channels.cache.
      } else {
        Utils.testChannel(process.env.ANN, 'Announcement');
        Utils.testChannel(process.env.OPEN, 'Daily Openings');
        Utils.testChannel(process.env.PUZZ, 'Puzzles');
        Utils.testChannel(process.env.LOG, 'Logging');
      }
    } else if (args[0]=='puzzle') {
      if (args[1]=='real') {
        Utils.postPuzzle();
      } else {
        Utils.postPuzzle(true);
      }
    } else if (args[0]=='opening') {
      Utils.postOpening();
    } else if (args[0]=='poll') {
      PollService.createPoll(msg, 'Test Poll',
        'This is the description of the poll. React to cast your vote.');
    } else if (args[0]=='reactions') {
      msg.reply('These are the default reactions.')
        .then((msg) => PollService.react(msg));
      msg.reply('').then(async (evt) => {
        const custom = await Prompt.input(
          'Enter a list of emojis to react with.', msg.channel,
          msg.author, 30000);
        PollService.react(evt, custom.split(/ +/));
      });
    } else if (args[0]=='dm') {
      Utils.sendDM('This is a test DM', msg.author);
    }

    return true;
  }

  getHelp(): string {
    return 'Test functions of the bot';
  }
}
