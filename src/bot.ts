import * as Discord from 'discord.js';
import * as publicIp from 'public-ip';
import {CommandService} from './services/command.service';
import {Logger} from './utils/logger';
import {DB} from './services/db.service';
import {Roles} from './services/roles.service';
import {Config} from './config';
import {Counter} from './services/counter.service';
export namespace Bot {
  export let api: Discord.Client;
  let discordToken: string;

  // set name
  const NAME = (Config.isProd ?'𝖂𝕮𝕮𝕭':'𝖂𝕮𝕮𝕭 𝕯𝕰𝖁');
  // set prefix
  export let PREFIX: string;
  if (Config.isProd) {
    PREFIX = '::';
  } else {
    PREFIX = '""';
  }
  export const useDB = (Config.DB.USEDB == 'true');
  export const primaryColour = '#00FA9A'; // chess green

  export async function start() {
    api = new Discord.Client();
    if (Config.TOKEN) discordToken = Config.TOKEN;
    else throw new Error('Environment variable "DISCORD_TOKEN" is missing.');

    Config.init();

    await api.login(discordToken);

    api.on('ready', async () => {
      if (useDB) {
        DB.init();
      }
      await Logger.log('WCC Bot has started!');
      await Logger.log(`Connected as ${api.user.tag}`);
      await Logger.log('Current version: ' + Config.getVersion());

      await Logger.log('Setting up other config');

      if (Config.logIP) {
        await Logger.log('IP logging is enabled.');
        await (async () => {
          await Logger.log('Public IP is ' + await publicIp.v4());
        })();
      } else await Logger.log('IP logging is disabled.');
      await Logger.log(`USEDB=${Config.DB.USEDB}`);
      Counter.init();

      await api.user.setUsername(NAME);
      await api.user.setAFK(false);
      await api.user.setActivity(
          `${Bot.PREFIX}help | v${Config.getVersion()}`, {type: 'PLAYING'});
      await CommandService.registerCommands();
    });

    api.on('guildMemberAdd', (member) => {
      Logger.log(`${member.user.tag} has joined the server`);
      // TODO: guilds filtering
      Roles.add(member, Config.ID.DEFROLE);
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

