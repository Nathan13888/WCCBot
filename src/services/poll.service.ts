import {Message, MessageEmbed} from 'discord.js';
import {Bot} from '../bot';
import {Utils} from '../utils/utils';
import {CommandService} from './command.service';
import {Logger} from '../utils/logger';

export namespace PollService {
    // creates a poll in the announcements channel
    export async function createPollPrompt(msg: Message,
      cleanup: boolean = false, channel?: string): Promise<MessageEmbed> {
      if (channel) {
        cleanup = true;
      } else { // channel == undefined
        channel = process.env.POLL;
      }
      const title: string = await CommandService.promptInput(
        'Enter title.', msg.channel, msg.author, 240000, cleanup);
      const desc: string = await CommandService.promptInput(
        'Enter description.', msg.channel, msg.author, 240000, cleanup);
      const embed = createPoll(msg, title, desc, false);
      msg.reply('This is how it will look like.').then((msg) => {
        msg.delete({timeout: 1000});
      });
      msg.channel.send(embed).then((msg)=>{
        msg.delete({timeout: 20000});
      });
      const confirm = await CommandService.promptConfirm(
        'this poll message', msg.channel, msg.author, cleanup);
      if (confirm) {
        Utils.getTextChannel(channel).send(embed).then((msg)=> {
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
    // TODO: fix emoji lookup
    export function react(msg: Message, custom?: string): void {
      if (!custom) {
        msg.react('🔥');
        msg.react('👍');
        msg.react('👎');
      } else {
        const args: string[] = custom.split(/ +/);
        for (const x of args) {
          Logger.log(x);
          const emoji = findEmoji(x);
          // if (!emoji) {
          //   continue;
          // }
          try {
            if (emoji) {
              msg.react(emoji);
            } else {
              msg.channel.send(`Emoji with the name '${x}' was not found.`);
            }
          } catch (error) {
            Logger.log(error);
          }
        }
      }
    }
    function findEmoji(x: string) {
      return Bot.api.emojis.cache.find((e) => e.name === x);
    }
}
