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
    const guild = msg.guild;
    if (args.length == 0) {
      // const map = new Map<Role, number>();
      await guild.roles.fetch();
      const roles = guild.roles.cache.sort();
      // roles.forEach((role) => {
      //   map.set(role, 0);
      // });
      // guild.members.cache.forEach((mem) => {
      //   mem.roles.cache.forEach((r) => {
      //     map.set(r, 1 + map.get(r));
      //   });
      // });
      const embed = Utils.getDefEmbed().setTitle('List Roles').setTimestamp();
      roles.forEach((role) => {
        embed.addField(role.name, role.members.size);
      });
      msg.reply(embed);
      return true;
    }
    if (args.length==1) {
      const role = await guild.roles.fetch(args[0].replace(/\D/g, ''));
      const size = role.members.size;
      const desc = `There ${size>1?'are':'is'} ${size} ` +
      `${size>1?'members':'member'} with ` +
      `<@&${role.id}>`;
      msg.reply(desc);
      // msg.reply(Utils.getDefEmbed().setTimestamp().setDescription(desc));
      return true;
    }
    return false;
  }

  getHelp(): string {
    return 'Lists information about roles';
  }
}
