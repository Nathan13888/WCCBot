import {Message, MessageEmbed} from 'discord.js';
import {Bot} from '../bot';
import {Utils} from '../utils/utils';
import {Command} from './command';

export class Help extends Command {
  getHelp(): string {
    return 'Shows you helpful information about the available commands';
  }

  async exec(msg: Message, args: string[]): Promise<boolean> {
    msg.react('👌');
    if (args[0] == 'quick') {
      msg.channel.send(getHelpEmbed()).then(
        (msg)=>msg.delete({timeout: 5000}),
      );
    } else {
      msg.reply('Read your DMs').then((msg)=>msg.delete({timeout: 3000}));
      Utils.sendDM(getHelpEmbed(), msg.author);
    }
    return true;
  }

  getAliases(): string[] {
    return ['help'];
  }
}

// TODO: use Default Embed
function getHelpEmbed(): MessageEmbed {
  const embed = new MessageEmbed()
    .setColor(Bot.primaryColour)
    .setTitle(Bot.api.user.username + ' Commands')
    .setDescription('Here\'s a list of the available commands')
    .setThumbnail(Bot.api.user.displayAvatarURL())
    .addFields(
      {name: 'help', value: '*returns this message*'},
      {name: 'invite', value: '*gives you an invite to this server*'},
      {name: 'randomopening', value: '*gives you a random opening*'},
      {name: 'randompuzzle', value: '*gives you a random puzzle*'},
      {name: 'version', value: '*the current version of the bot*'},
      {name: 'alive', value: '*tells you if the bot is active*'},
      {name: 'status', value: '*the current status of the bot*'},
      {name: 'server', value: '*information about the server*'},
      // {name: 'uptime', value: 'How long the bot has been running'},
      // {name: 'info', value: 'General information about the bot'},
    )
    .setTimestamp()
    .setFooter('Written by papa Bruce and Nathan');
  // .setFooter(Bot.api.user.tag, Bot.api.user.displayAvatarURL());
  return embed;
}
