import {Message, MessageEmbed} from 'discord.js';
import {Bot} from '../bot';
import {Utils} from '../utils/utils';
import {CommandService} from './command.service';

export namespace PollService {
    // creates a poll in the announcements channel
    export async function createPollPrompt(msg: Message):
      Promise<MessageEmbed> {
      const title: string = await CommandService.promptInput(
        'Enter title.', msg.channel, msg.author, 60000);
      const desc: string = await CommandService.promptInput(
        'Enter description.', msg.channel, msg.author, 60000);
      const embed = createPoll(msg, title, desc, false);
      msg.reply('This is how it will look like.');
      msg.channel.send(embed);
      const confirm = await CommandService.promptConfirm(
        'this poll message', msg.channel, msg.author);
      if (confirm) {
        Utils.getTextChannel(process.env.POLL).send(embed).then((msg)=> {
          react(msg);
        });
      }

      return embed;
    }
    // TODO: keep track of the reactions of the poll
    // TODO: add `cb` Promise to call back with the sent message
    export function createPoll(
      msg: Message, title: string, desc: string, post: boolean = true,
    ): MessageEmbed {
      // let image: string;
      const embed = new MessageEmbed()
        .setColor(Bot.primaryColour)
        .setTitle(title)
        .setDescription(desc)
        // .setThumbnail(image)
        // .setImage() // TODO: add option to add image
        .setTimestamp()
        .setFooter('Posted by ' + msg.member.displayName,
          msg.author.displayAvatarURL());
      if (post) {
        Utils.getTextChannel(process.env.POLL).send(embed).then((msg)=> {
          react(msg);
        });
      }
      return embed;
    }
    function react(msg: Message) {
      msg.react('🔥');
      msg.react('👍');
      msg.react('👎');
    }
}
