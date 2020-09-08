import {GuildMember, PartialGuildMember, Role} from 'discord.js';
import {Utils} from '../utils/utils';

export namespace Roles {
  export function checkMin(guild: string): Array<GuildMember> {
    const changed: Array<GuildMember> = [];
    Utils.getGuild(guild).members.cache.forEach((member) => {
      // filter bots
      if (!member.user.bot) {
        if (!has(member, process.env.DEFROLE)) {
          const role = get(guild, process.env.DEFROLE);
          member.roles.add(role);
          changed.push(member);
        }
      }
    });
    return changed;
  }
  export function get(guild: string, roleID: string): Role {
    return Utils.getGuild(guild).roles.cache.get(roleID);
  }
  export function has(member: GuildMember | PartialGuildMember,
    id: string): boolean {
    return member.roles.cache.some((role) => role.id===id);
  }
  export function add(member: GuildMember | PartialGuildMember,
    id: string): boolean {
    if (!member.user.bot) { // not a bot
      member.roles.add(id);
      return true;
    }
    return false;
  }
  export function remove(member: GuildMember | PartialGuildMember,
    id: string): boolean {
    if (has(member, id)) {
      member.roles.remove(id); // optional: reason
      return true;
    }
    return false;
  }
}
