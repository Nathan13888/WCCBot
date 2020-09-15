import {Message} from 'discord.js';
import {Config} from '../config';
import {CommandService} from '../services/command.service';
import {Roles} from '../services/roles.service';
import {Command} from './command';
import {DB} from '../services/db.service';
import {Prompt} from '../services/prompt.service';

export class Verify extends Command {
  getAliases(): string[] {
    return ['verify'];
  }
  async exec(msg: Message, args: string[]): Promise<boolean> {
    if (!await Roles.has(msg.member, Config.ID.VER)) {
      msg.reply('A DM has been sent to verify your identity, check your DMs');
      const channel = await msg.author.createDM();
      const fullname = await Prompt.input('Enter full name',
        channel, msg.author, 240000);
      console.log(fullname);
      const grade = await Prompt.input('Enter current grade',
        channel, msg.author, 240000);
      console.log(grade);
      const SN = await Prompt.input('Enter student number',
        channel, msg.author, 240000);
      console.log(SN);
      const lichess = await Prompt.input(
        'Optional: Enter LiChess username', channel, msg.author, 240000);
      const chesscom = await Prompt.input('Optional: Enter Chess.com username',
        channel, msg.author, 240000);
      DB.addUser(msg.author.id, fullname, grade, SN, lichess, chesscom);
      msg.author.send('You have been verified!');
      msg.guild.member(msg.author).roles
        .add(await msg.guild.roles.fetch(Config.ID.VER));
      return true;
    }
    msg.reply('You are already verified.');
    return true;
    // if (args.length==0) {
    //   if (Roles.has(msg.member, Config.ID.VER)) {
    //     if (Roles.has(msg.member, Config.ID.KNIGHT)) {
    //       msg.reply('You are **already verified**!');
    //     } else {
    //       msg.reply(`You must have the <@&${Config.ID.KNIGHT}> role!`);
    //     }
    //   } else {
    //     Roles.add(msg.member, Config.ID.VER);
    //     msg.reply('You have **been verified**!');
    //   }
    // } else if (args.length==1 && CommandService.hasPermit(msg.author.id)) {
    //   if (args[0]=='all') {
    //     let cntb = 0; // total bots
    //     let cnt0 = 0; // totally people
    //     let cnt1 = 0; // people given roles
    //     let cnt2 = 0; // people not given roles
    //     let cnt3 = 0; // people already verified
    //     Roles.getMembers(Config.GUILD).forEach((member) => {
    //       if (!member.user.bot) {
    //         cnt0++;
    //         // if (Roles.has(member,
    //         //   [Config.ID.DEFROLE, Config.ID.KNIGHT])) {
    //         if (// Roles.has(member, Config.ID.DEFROLE) &&
    //           Roles.has(member, Config.ID.KNIGHT)) {
    //           if (!Roles.has(member, Config.ID.VER)) {
    //             Roles.add(member, Config.ID.VER);
    //             cnt1++;
    //           } else cnt3++;
    //         } else cnt2++;
    //       } else {
    //         cntb++;
    //       }
    //     });
    //     msg.reply(
    //       `${cntb} bots. ${cnt0} people. ${cnt1} given roles. ` +
    //       `${cnt2} NOT given roles. ${cnt3} ALREADY given roles.`);
    //   } else {
    //     return false;
    //   }
    // } else {
    //   return false;
    // }
    // return true;
  }

  getHelp(): string {
    return 'Verifies your account';
  }
}
