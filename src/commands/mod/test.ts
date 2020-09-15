import {Message, TextChannel} from 'discord.js';
import {Config} from '../../config';
import {Menu} from '../../services/menu.service';
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
        Utils.testChannel(Config.Channels.announcements, 'Announcement');
        Utils.testChannel(Config.Channels.openings, 'Daily Openings');
        Utils.testChannel(Config.Channels.puzzles, 'Puzzles');
        Utils.testChannel(Config.Channels.logs, 'Logging');
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
    } else if (args[0]=='menu') {
      const menu = new Menu((msg.channel as TextChannel), msg.author.id, 3,
        (pg) => {
          const ret = [
            Utils.getDefEmbed().addFields(
              {name: 'test', value: 'test'},
              {name: 'test2', value: 'test'},
              {name: 'test3', value: 'test'},
            ),
            Utils.getDefEmbed().addFields(
              {name: 'test4', value: 'test'},
              {name: 'test5', value: 'test'},
              {name: 'test6', value: 'test'},
            ),
            Utils.getDefEmbed().addFields(
              {name: 'test7', value: 'test'},
              {name: 'test8', value: 'test'},
              {name: 'test9', value: 'test'},
            ),
          ];
          return ret[pg];
        });
      menu.send();
    }

    return true;
  }

  getHelp(): string {
    return 'Test functions of the bot';
  }
}
