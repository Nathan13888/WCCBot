import {Message, MessageEmbed} from 'discord.js';
import {Config} from '../../config';
import {Prompt} from '../../services/prompt.service';
import {Utils} from '../../utils/utils';
import {Command} from '../command';
import {Bot} from '../../bot';

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
      'Enter title:',
      msg.channel, msg.author);
    const message = await Prompt.input(
      'Enter message:',
      msg.channel, msg.author);
    const embed = new MessageEmbed()
      // .setAuthor()
      .setColor(Bot.primaryColour)
      .setTitle(title)
      .setDescription(message)
      .setFooter('Sent by ' + msg.member.displayName, msg.author.avatarURL())
      .setTimestamp();
    await msg.channel.send(embed);
    if (await Prompt.confirm('Do you want to send this message?',
      msg.channel, msg.author)) {
      if (await Prompt.confirm('Would you like to mention @SUBSCRIBED',
        msg.channel, msg.author)) {
        await Utils.getTextChannel(Config.Channels.announcements).send(
          '<@&752601060597563503> A new announcement has been posted.');
      }
      await Utils.getTextChannel(Config.Channels.announcements).send(embed);
    } else {
      await msg.channel.send('Announcement not sent.');
    }

    return true;
  }

  getHelp(): string {
    return 'WIP Make an announcement';
  }
}
