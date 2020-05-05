import * as Discord from "discord.js";
import { CommandService } from "./services/command.service";
import { Logger } from "./utils/logger";

let api: Discord.Client;
export class Bot {
  embed: Discord.MessageEmbed;

  discordToken: string;
  commandService: CommandService;

  constructor() {
    api = new Discord.Client();
    if (process.env.DISCORD_TOKEN)
      this.discordToken = process.env.DISCORD_TOKEN;
    else throw new Error("Discord token needed."); // TODO: Hook to Logger
    this.commandService = new CommandService();

    this.init();
    api.login(this.discordToken);
  }

  init() {
    api.once("ready", () => {
      Logger.log("WCC Bot has started!");
      Logger.log(`Connected as ${this.api.user.tag}`);
      this.api.user.setActivity("Chess and w!", { type: "PLAYING" });
    });

    api.on("message", (msg) => {
      if (msg.author.bot) return;
      if (msg.content.substring(0, 2) == "w!")
        this.commandService.parseCommand(msg);
    });
  }
}
