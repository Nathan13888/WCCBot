import * as Discord from 'discord.js';
import * as publicIp from 'public-ip';
import { CommandService } from './services/command.service';
import { Logger } from './utils/logger';
export namespace Bot {
  export let api: Discord.Client;
  export let announcementChannel: Discord.TextChannel
    | Discord.DMChannel | Discord.NewsChannel;
  export let reminderChannel: Discord.TextChannel
    | Discord.DMChannel | Discord.NewsChannel;
  let discordToken: string;

  export async function start() {
    api = new Discord.Client();
    if (process.env.DISCORD_TOKEN) discordToken = process.env.DISCORD_TOKEN;
    else throw new Error('Environment variable "DISCORD_TOKEN" is missing.');

    api.login(discordToken);

    api.on('ready', async () => {
      Logger.log('WCC Bot has started!');
      Logger.log(`Connected as ${api.user.tag}`);

      Logger.log('Setting up other config');

      if (process.env.IP == "true") {
        Logger.log("IP logging is enabled.");
        (async () => {
          Logger.log('Public IP is ' + await publicIp.v4());
        })();
      } else Logger.log("IP logging is disabled.");

      api.user.setUsername('𝖂𝕮𝕮𝕭');
      api.user.setAFK(false);
      api.user.setActivity('Chess and ::help', { type: 'PLAYING' });
      announcementChannel = Bot.api.channels.cache.get(
        process.env.ANN) as Discord.TextChannel;
      // TODO: Allow different announcement and reminder channels
      reminderChannel = announcementChannel;
      CommandService.registerCommands();
    });
  }
}

