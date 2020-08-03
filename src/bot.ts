import * as Discord from 'discord.js';
import * as fetch from 'node-fetch';
import * as publicIp from 'public-ip';
import {CommandService} from './services/command.service';
import {Logger} from './utils/logger';
import {Utils} from './utils/utils';
import {DB} from './services/db.service';
export namespace Bot {
  export let api: Discord.Client;
  export let announcementChannel: Discord.TextChannel
    | Discord.DMChannel | Discord.NewsChannel;
  export let reminderChannel: Discord.TextChannel
    | Discord.DMChannel | Discord.NewsChannel;
  let discordToken: string;

  // set prefix
  export let PREFIX: string;
  if (process.env.NODE_ENV==='production') {
    PREFIX = '::';
  } else {
    PREFIX = '""';
  }
  export const primaryColour = '#00FA9A'; // chess green

  export interface Permit {
    permitted: Array<string>
  }

  let permit: Permit = undefined;

  export function getPermit(): Permit {
    return permit;
  }

  export async function start() {
    api = new Discord.Client();
    if (process.env.DISCORD_TOKEN) discordToken = process.env.DISCORD_TOKEN;
    else throw new Error('Environment variable "DISCORD_TOKEN" is missing.');

    api.login(discordToken);

    api.on('ready', async () => {
      DB.init();
      Logger.log('WCC Bot has started!');
      Logger.log(`Connected as ${api.user.tag}`);
      Logger.log('Current version: ' + Utils.getVersion());

      Logger.log('Setting up other config');

      if (process.env.IP == 'true') {
        Logger.log('IP logging is enabled.');
        (async () => {
          Logger.log('Public IP is ' + await publicIp.v4());
        })();
      } else Logger.log('IP logging is disabled.');
      Utils.Counter.init();

      api.user.setUsername('𝖂𝕮𝕮𝕭');
      api.user.setAFK(false);
      api.user.setActivity(`Chess and ${Bot.PREFIX}help`, {type: 'PLAYING'});
      announcementChannel = Bot.api.channels.cache.get(
        process.env.ANN) as Discord.TextChannel;
      // TODO: Allow different announcement and reminder channels
      reminderChannel = announcementChannel;
      fetch(process.env.PERMIT, {method: 'Get'}).then((res) => res.json())
        .then((json) => {
          permit = json;
        });
      CommandService.registerCommands();
    });

    api.on('guildMemberAdd', (member) => {
      Logger.log(`${member.user.tag} has joined the server`);
      // TODO: guilds filtering
      member.roles.add(process.env.DEFROLE);
    });
    api.on('guildMemberRemove', (member) => {
      Logger.log(`${member.user.tag} has left the server`);
    });
    api.on('disconnect', () => {
      DB.disconnect();
    });
  }
}

