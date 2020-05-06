import * as Discord from 'discord.js';
import {Logger} from './utils/logger';
import {CommandService} from './services/command.service';
export namespace Bot {
  export let api: Discord.Client;
  // let embed: Discord.MessageEmbed;
  let discordToken: string;

  api = new Discord.Client();
  if (process.env.DISCORD_TOKEN) discordToken = process.env.DISCORD_TOKEN;
  else throw new Error('Environment variable "DISCORD_TOKEN" is missing.');

  api.login(discordToken);

  api.on('ready', async () => {
      Logger.log('WCC Bot has started!');
      Logger.log(`Connected as ${api.user.tag}`);
      api.user.setUsername('𝖂𝕮𝕮𝕭');
      api.user.setAFK(false);
      api.user.setActivity('of Chess and w!help', {type: 'PLAYING'});
  });

  CommandService.registerCommands();
}

