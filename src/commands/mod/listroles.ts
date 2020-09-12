import {Message} from 'discord.js';
import {Roles} from '../../services/roles.service';
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
      const guild = msg.guild.id;
      const map = new Map<string, number>();
      await Roles.getRoles(guild).forEach((role, key) => {
        map.set(key, 0);
      });
      Roles.getMembers(guild).forEach((mem) => {
        mem.roles.cache.forEach((r, k) => {
          map.get(k)+1;
        });
      });
      const embed = Utils.getDefEmbed().setTitle('List Roles').setTimestamp();
      map.forEach((cnt, id) => {
        embed.addField(Roles.get(guild, id).name, `${cnt}`);
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
