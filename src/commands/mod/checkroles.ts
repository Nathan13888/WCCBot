import {GuildMember, Message} from 'discord.js';
import {Roles} from '../../services/roles.service';
import {Logger} from '../../utils/logger';
import {Command} from '../command';

export class CheckRoles extends Command {
  needsPermit(): boolean {
    return true;
  }

  getAliases(): string[] {
    return ['checkroles'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    msg.reply('Checking roles...');
    const changed: Array<GuildMember> =
            Roles.checkMin(msg.guild.id);
    changed.forEach((member) => {
      const s = `${member.user.tag} has been given the default role`;
      msg.reply(s);
      Logger.log('[Check Roles] ' + s);
    });
    msg.reply('Done.');

    return true;
  }

  getHelp(): string {
    return 'Checks if all members have the minimum required role';
  }
}
