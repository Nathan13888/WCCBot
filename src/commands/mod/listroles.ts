import {Message} from 'discord.js';
import {Utils} from '../../utils/utils';
import {Command} from '../command';

export class ListRoles extends Command {
  needsPermit(): boolean {
    return true;
  }

  getAliases(): string[] {
    return ['listroles', 'LR'];
  }

  async exec(msg: Message, args: string[]): Promise<boolean> {
    msg.delete();
    if (args.length == 0) {
      const guild = msg.guild;
      const map = new Map<string, number>();
      await guild.roles.fetch();
      const roles = guild.roles.cache.sort((a, b) => b.position - a.position);
      roles.forEach((role) => {
        map.set(role.id, 0);
      });
      await guild.members.fetch();
      guild.members.cache.forEach((mem) => {
        mem.roles.cache.forEach((r) => {
          map.set(r.id, map.get(r.id)+1);
        });
      });
      const embed = Utils.getDefEmbed().setTitle('List Roles').setTimestamp();
      roles.forEach((role) => {
        embed.addField(role.name, map.get(role.id));
      });
      msg.reply(embed);
    } else {
      return false;
    }

    return true;
  }

  getHelp(): string {
    return 'Lists information about roles';
  }
}
