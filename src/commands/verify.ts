import {Message} from 'discord.js';
import {Config} from '../config';
import {CommandService} from '../services/command.service';
import {Roles} from '../services/roles.service';
import {Command} from './command';

export class Verify extends Command {
  getAliases(): string[] {
    return ['verify'];
  }

  async exec(msg: Message, args: string[]): Promise<boolean> {
    if (args.length==0) {
      if (Roles.has(msg.member, Config.ID.VER)) {
        msg.reply('You are **already verified**!');
      } else {
        Roles.add(msg.member, Config.ID.VER);
        msg.reply('You have **been verified**!');
      }
    } else if (args.length==1 && CommandService.hasPermit(msg.author.id)) {
      if (args[0]=='all') {
        let cntb = 0; // total bots
        let cnt0 = 0; // totally people
        let cnt1 = 0; // people given roles
        let cnt2 = 0; // people not given roles
        Roles.getMembers(Config.GUILD).forEach((member) => {
          if (!member.user.bot) {
            cnt0++;
            // if (Roles.has(member,
            //   [Config.ID.DEFROLE, Config.ID.KNIGHT])) {
            if (Roles.has(member, Config.ID.DEFROLE) &&
            Roles.has(member, Config.ID.KNIGHT)) {
              Roles.add(member, Config.ID.VER);
              cnt1++;
            } else cnt2++;
          } else {
            cntb++;
          }
        });
        msg.reply(
          `${cntb} Bots. ${cnt0} People. ${cnt1} given roles. ` +
          `${cnt2} NOT given roles.`);
      } else {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }

  getHelp(): string {
    return 'Verifies your account';
  }
}
