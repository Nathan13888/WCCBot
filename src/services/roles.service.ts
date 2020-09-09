import {Collection, GuildMember, PartialGuildMember, Role} from 'discord.js';
import {Config} from '../config';
import {Utils} from '../utils/utils';

export namespace Roles {
  export function getMembers(guild: string): Collection<string, GuildMember> {
    return Utils.getGuild(guild).members.cache;
  }
  export function checkMin(guild: string): Array<GuildMember> {
    const changed: Array<GuildMember> = [];
    getMembers(guild).forEach((member) => {
      // filter bots
      if (!member.user.bot) {
        if (!has(member, Config.ID.DEFROLE)) {
          const role = get(guild, Config.ID.DEFROLE);
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
