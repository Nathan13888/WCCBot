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

  export const isProd: boolean = process.env.NODE_ENV==='production';
  // set name
  const NAME = (isProd ?'𝖂𝕮𝕮𝕭':'𝖂𝕮𝕮𝕭 𝕯𝕰𝖁');
  // set prefix
  export let PREFIX: string;
  if (isProd) {
    PREFIX = '::';
  } else {
    PREFIX = '""';
  }
  export const useDB = (process.env.USEDB == 'true');
  export const primaryColour = '#00FA9A'; // chess green

  // TODO: Move permissions stuff to permit.service.ts
  export interface Permit {
    permitted: Array<string>,
  }

  const defPermit: Permit = {
    'permitted': [
      '259464008262746113',
      '269220748730695681',
    ],
  };
  let permit: Permit = undefined;

  export function getPermit(): Permit {
    if (permit == undefined) {
      const message = 'PERMIT IS MISSING ! ! !';
      Logger.log(message);
      // throw new Error(message);
      return defPermit;
    }
    return permit;
  }

  export async function start() {
    api = new Discord.Client();
    if (process.env.DISCORD_TOKEN) discordToken = process.env.DISCORD_TOKEN;
    else throw new Error('Environment variable "DISCORD_TOKEN" is missing.');

    api.login(discordToken);

    api.on('ready', async () => {
      if (useDB) {
        DB.init();
      }
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
      Logger.log(`USEDB=${process.env.USEDB}`);
      Utils.Counter.init();

      api.user.setUsername(NAME);
      api.user.setAFK(false);
      api.user.setActivity(
        `${Bot.PREFIX}help | v${Utils.getVersion()}`, {type: 'PLAYING'});
      announcementChannel = Bot.api.channels.cache.get(
        process.env.ANN) as Discord.TextChannel;
      // TODO: Allow different announcement and reminder channels
      reminderChannel = announcementChannel;
      // TODO: improve fetching mechanism
      fetch(process.env.PERMIT, {method: 'Get'}).then((res: any) => res.json())
        .then((json: Permit) => {
          permit = json;
        });
      CommandService.registerCommands();
    });

    api.on('guildMemberAdd', (member) => {
      Logger.log(`${member.user.tag} has joined the server`);
      // TODO: guilds filtering
      if (!member.user.bot) {
        member.roles.add(process.env.DEFROLE);
      }
    });
    api.on('guildMemberRemove', (member) => {
      Logger.log(`${member.user.tag} has left the server`);
    });
    api.on('disconnect', () => {
      if (useDB) {
        DB.disconnect();
      }
    });
  }
}

