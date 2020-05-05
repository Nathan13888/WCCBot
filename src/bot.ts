import * as Discord from "discord.js";
import { CommandService } from "./services/command.service";
import { Logger } from "./utils/logger";
export namespace Bot {
  export let api: Discord.Client;
  let embed: Discord.MessageEmbed;
  let discordToken: string;
  let commandService: CommandService;

  api = new Discord.Client();
  if (process.env.DISCORD_TOKEN) discordToken = process.env.DISCORD_TOKEN;
  else throw new Error('Environment variable "DISCORD_TOKEN" is missing.');
  commandService = new CommandService();

  api.login(discordToken);

  api.once("ready", () => {
    Logger.log("WCC Bot has started!");
    Logger.log(`Connected as ${api.user.tag}`);
    api.user.setActivity("Chess and w!", { type: "PLAYING" });
  });

  api.on("message", msg => {
    if (msg.author.bot) return;
    if (msg.content.substring(0, 2) == "w!") commandService.parseCommand(msg);
  });
}

