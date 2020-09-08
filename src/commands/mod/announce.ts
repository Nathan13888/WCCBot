import {Message, MessageEmbed} from 'discord.js';
import {Config} from '../../config';
import {Prompt} from '../../services/prompt.service';
import {Utils} from '../../utils/utils';
import {Command} from '../command';

export class Announce extends Command {
  needsPermit(): boolean {
    return true;
  }

  getAliases(): string[] {
    return ['announce'];
  }

  // TODO: finish REMINDERS
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    const title = await Prompt.input(
      'Please tell me the title.',
      msg.channel, msg.author);
    if (!title) {
      msg.channel.send('Timed out. Please try again.');
      return;
    }
    const message = await Prompt.input(
      'Please tell me the message.',
      msg.channel, msg.author, 120000);
    if (!message) {
      msg.channel.send('Timed out. Please try again.');
      return;
    }
    const embed = new MessageEmbed()
      // .setAuthor()
      .setColor(0xd62320)
      .setTitle(title)
      .setDescription(message)
      .setFooter(msg.author.tag, msg.author.avatarURL());

    const confirmation = await Prompt.input(
      'Please confirm the announcement. (Yes/no)',
      msg.channel, msg.author, 30000);
    if (!(confirmation && confirmation.toLowerCase() === 'yes')) {
      msg.channel.send(
        'Your announcement has been cancelled.',
      );
    } else {
      Utils.getTextChannel(Config.Channels.announcements).send(embed);
    }

    return true;
  }

  getHelp(): string {
    return 'WIP Make an announcement';
  }
}
