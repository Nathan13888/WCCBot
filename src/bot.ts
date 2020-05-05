import * as Discord from 'discord.js';
import { CommandService } from './services/command.service';
import { Logger } from './utils/logger';

export class Bot {
    api: Discord.Client;
    discordToken: string;
    commandService: CommandService;

    constructor() {
        this.api = new Discord.Client();
        if (process.env.DISCORD_TOKEN)
            this.discordToken = process.env.DISCORD_TOKEN;
        else throw new Error('Environment variable "DISCORD_TOKEN" is missing.');
        this.commandService = new CommandService();

        this.init();
    }

    init() {
        this.api.login(this.discordToken);

        // this.api.user.setActivity('Chess Club', {type: 'PLAYING'} );

        this.api.on('ready', () => {
            Logger.log('WCC Bot has started!');
            Logger.log(`Connected as ${this.api.user.tag}`);
        });
        
        this.api.on('message', msg => {
            if(msg.author.bot) return;
            if (msg.content.substring(0, 2) == 'w!') this.commandService.parseCommand(msg);
        });
    }
}

export const bot = new Bot();
