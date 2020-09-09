import {Message, MessageEmbed} from 'discord.js';
import {Bot} from '../bot';
import {Config} from '../config';
import {Utils} from '../utils/utils';
import {Prompt} from './prompt.service';

export namespace PollService {
  // ! https://emojipedia.org/

  const DICT: string[] = [
    '0️⃣',
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    '6️⃣',
    '7️⃣',
    '8️⃣',
    '9️⃣',
    '🔟',
  ];

  // creates a poll in the polls channel
  export async function createPollPrompt(msg: Message,
    cleanup: boolean = false, channel?: string): Promise<MessageEmbed> {
    if (channel) {
      cleanup = true;
    } else { // channel == undefined
      channel = Config.Channels.polls;
    }
    // TODO: add ESCAPE MESSAGE (exit form after detecting)
    const title: string = await Prompt.input(
      'Enter **title**.', msg.channel, msg.author, 240000, cleanup);
    const desc: string = await Prompt.input(
      'Enter **description**.', msg.channel, msg.author, 240000, cleanup);

    const makeList = await Prompt.confirm(
      'Would you like to **add a list**?',
      msg.channel, msg.author, cleanup);
    const list: Array<string> = [];
    // TODO: edit list feature
    if (makeList) {
      msg.reply(
        'Enter the individual options... (max=10,`STOP` to continue).')
        .then((msg) => {
          if (cleanup) msg.delete({timeout: 1000});
        });
      let res: string;
      while ((res = await Prompt.input(
        `List: enter **item ${list.length + 1}**.`,
        msg.channel, msg.author, 240000, cleanup))
        .toLowerCase() != 'stop' &&
      list.length < DICT.length - 1/* items < emojis */) {
        list.push(res);
      }
      msg.reply('Stopping...')
        .then((msg) => {
          if (cleanup) msg.delete({timeout: 1000});
        });
    }
    const count: number = list.length;

    const embed = createPoll(msg, title, desc, false, list);
    msg.reply('This is how it will look like.').then((msg) => {
      if (cleanup) msg.delete({timeout: 1000});
    });
    msg.channel.send(embed).then((msg) => {
      if (cleanup) msg.delete({timeout: 20000});
    });
    // TODO: notify which channel the poll will be posted at
    const confirm = await Prompt.confirm(
      'Please confirm this poll message.', msg.channel, msg.author, cleanup);
    if (confirm) {
      Utils.getTextChannel(channel).send(embed).then((msg) => {
        // TODO: improve code quality, shorten to the same react function
        if (makeList) {
          msg.react('🔥');
          react(msg, DICT.slice(1, count + 1));
        } else {
          react(msg);
        }
      });
      if (channel == Config.Channels.polls) {
        // TODO: auto detect channel name based on ID
        await Utils.getTextChannel(Config.Channels.announcements)
          .send(`A new poll has been posted at <#${Config.Channels.polls}>.`);
      }
    }

    return embed;
  }

  export async function editPoll(msg: Message,
    cleanup: boolean, channel?: string): Promise<MessageEmbed> {
    if (!channel) {
      channel = Config.Channels.polls;
    }
    const messageid: string = await Prompt.input(
      'Enter Message ID', msg.channel, msg.author, 240000, cleanup);
    const pollchannel = Utils.getTextChannel(channel);
    const message = await pollchannel.messages.fetch(messageid);
    const embed = message.embeds[0];
    await msg.channel.send(embed);
    if (await Prompt.confirm('Is this the correct message?',
      msg.channel, msg.author)) {
      let lv = true;
      embed
        .setFooter('Edited by ' + msg.member.displayName,
          msg.author.displayAvatarURL()).setTimestamp();
      while (lv) {
        const mod: string = await Prompt.input(
          'Which option do you want to modify? (title/desc/option #)',
          msg.channel, msg.author, 240000, cleanup);
        if (mod == 'title') {
          embed.setTitle(await Prompt.input('Enter new title',
            msg.channel, msg.author));
        }
        if (mod == 'desc') {
          embed.setDescription(await Prompt.input('Enter new description',
            msg.channel, msg.author));
        } else {
          embed.fields[Number(mod)-1] = {
            name: DICT[mod],
            value: await Prompt.input(
              'Enter new field description for option ' +
              mod, msg.channel, msg.author),
            inline: true,
          };
        }
        await msg.channel.send(embed);
        lv = await Prompt.confirm('Continue editing?',
          msg.channel, msg.author);
        // TODO: Add creating and removing options
        // TODO: Beautify the loop cuz this is spaghetti.
      }
    }
    await msg.channel.send(embed);
    if (await Prompt.confirm('Send edited version?',
      msg.channel, msg.author)) {
      await message.edit(embed);
      // TODO: Ensure that this actually works once I deploy
    }
    return embed;
  }


  // TODO: keep track of the reactions of the poll
  // TODO: add `cb` Promise to call back with the sent message
  export function createPoll(
    msg: Message, title: string, desc: string, post: boolean = true,
    fields?: string[],
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
    if (fields.length > 0) {
      let cnt = 0;
      for (const f of fields) {
        embed.addField(DICT[++cnt], f);
      }
    }
    if (post) {
      Utils.getTextChannel(Config.Channels.polls).send(embed).then((msg) => {
        react(msg);
      });
    }
    return embed;
  }

  // TODO: fix emoji lookup
  export function react(msg: Message, custom?: string[]): void {
    if (!custom) {
      msg.react('🔥');
      msg.react('👍');
      msg.react('👎');
    } else {
      for (const x of custom) {
        // Logger.log(x);
        const emoji = Utils.findEmoji(x);
        // try {
        if (emoji) {
          msg.react(emoji);
        } else {
          msg.react(x);
        }
        // msg.channel.send(`Emoji with the name '${x}' was not found.`);
        // } catch (error) {
        //   Logger.log(error);
        // }
      }
    }
  }
}
