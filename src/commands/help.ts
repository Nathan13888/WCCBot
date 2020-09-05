import {Message, MessageEmbed} from 'discord.js';
import {Bot} from '../bot';
import {CommandService} from '../services/command.service';
import {Utils} from '../utils/utils';
import {Command} from './command';

export class Help extends Command {
  getHelp(): string {
    return 'Shows you helpful information about the available commands';
  }

  async exec(msg: Message, args: string[]): Promise<boolean> {
    msg.react('👌');
    const includeMod: boolean = CommandService.hasPermit(msg.author.id);
    if (args[0] == 'quick') {
      msg.channel.send(getHelpEmbed(includeMod)).then(
        (msg)=>msg.delete({timeout: 5000}),
      );
    } else {
      msg.reply('Read your DMs').then((msg)=>msg.delete({timeout: 3000}));
      Utils.sendDM(getHelpEmbed(includeMod), msg.author);
    }
    return true;
  }

  getAliases(): string[] {
    return ['help'];
  }
}

// TODO: use Default Embed
function getHelpEmbed(includeMod: boolean): MessageEmbed {
  const embed = new MessageEmbed()
    .setColor(Bot.primaryColour)
    .setTitle(Bot.api.user.username + ' Commands')
    .setDescription('Here\'s a list of the available commands')
    .setThumbnail(Bot.api.user.displayAvatarURL())
    .setTimestamp()
    .setFooter('Rewritten help page by Nathan 😉');
  // .setFooter(Bot.api.user.tag, Bot.api.user.displayAvatarURL());
  for (const com of CommandService.commands) {
    // TODO: cache help embed but watch out for enabled and disabled commands
    // TODO: also watch out for whether help includes commands for mod
    if (!com.needsPermit() || includeMod) {
      embed.addField(`__${com.getAliases()[0]}__`,
        `*${com.getHelp().replace('WIP', '**WIP**')}*`);
    }
  }
  return embed;
}
