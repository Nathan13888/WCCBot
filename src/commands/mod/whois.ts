import {DB} from '../../services/db.service';
import {Command} from '../command';
import {Message, MessageEmbed} from 'discord.js';
import {Logger} from '../../utils/logger';
import {Bot} from '../../bot';

export class Whois extends Command {
  needsPermit(): boolean {
    return true;
  }
  getHelp(): string {
    return 'Returns info on user.';
  }
  getAliases(): string[] {
    return ['whois'];
  }

  async exec(msg: Message, args: string[]): Promise<boolean> {
    if (args.length==0) {
      await msg.reply('This command requires 1 or more arguments!');
    }
    for (const userid of args) {
      const userclass = await DB.findbyUserID(userid.replace(/\D/g, ''));
      const user = await Bot.api.users.fetch(userid.replace(/\D/g, ''));
      Logger.log(msg.author.username + ' has looked up info for user' +
        user.username);
      const embed = new MessageEmbed().setTitle('Information of ' +
        user.username)
        .setTimestamp()
        .setFooter('Requested by ' + msg.member.displayName,
          msg.author.displayAvatarURL());
      embed.addField('Full Name:', userclass.fullname, true)
        .addField('Grade:', userclass.grade, true)
        .addField('Student Number', userclass.SN, true)
        .addField('Lichess Username', userclass.lichess, true)
        .addField('Chess.com Username', userclass.chesscom, true);
      msg.reply(embed);
    }
    return true;
  }
}
