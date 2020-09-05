import {Message} from 'discord.js';
import {Utils} from '../../utils/utils';
import {Command} from '../command';

export class Notifications extends Command {
  needsPermit(): boolean {
    return true;
  }

  getAliases(): string[] {
    return ['notif', 'notification', 'notifications'];
  }

  async exec(msg: Message, args: string[]): Promise<boolean> {
    if (args[0]=='ics') {
      // TODO: fix repeat messages...
      Utils.getGuild(msg.guild.id).members.cache.forEach((member) => {
        if (!member.user.bot) {
          if (!member.roles.cache.some((role) =>
            role.id===process.env.ICSR)) {
            const message = 'Hi WCC Discord server member. This is a ' +
              'reminder that you have been given the **IDENTITY CRISIS ' +
              'SUSPECT** role. Please contact **@Andy**, **@Daniel** or ' +
              '**@Nathan** to identify yourself. Otherwise, you may ' +
              'be removed in the future by failing to do so. ';
            Utils.sendDM(message, msg.author);
          }
        }
      });
    }

    return true;
  }

  getHelp(): string {
    return 'WIP Gives people notifications in DMs';
  }
}
