import {Collection, GuildMember, PartialGuildMember, Role} from 'discord.js';
import {Config} from '../config';
import {Utils} from '../utils/utils';

export namespace Roles {
  export function getRoles(guild: string): Collection<string, Role> {
    return Utils.getGuild(guild).roles.cache;
  }
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
    // id: string | string[]): boolean {
    // let search: string[] = [];
    // if (id instanceof String) {
    //   search.push((id as string));
    // } else {
    //   search = (id as string[]);
    // }
    // for (const r of search) {
    //   if (!member.roles.cache.some((role) => role.id===r)) {
    //     return false;
    //   }
    // }

    // return true;
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
