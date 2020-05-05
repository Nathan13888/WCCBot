import * as Discord from 'discord.js';
import { parseCommand } from './utils/commands';

export class Bot {
    api: Discord.Client;
    embed: Discord.MessageEmbed;
    private discordToken: string;

    constructor() {
        this.api = new Discord.Client();
        if (process.env.DISCORD_TOKEN)
            this.discordToken = process.env.DISCORD_TOKEN;
        else throw new Error('Discord token needed.');

        this.init();
        this.api.login(this.discordToken);
    }

    init() {

        this.api.once('ready', () => {
            this.log('WCC Bot has started!');
            this.log(`Connected as ${this.api.user.tag}`);
            this.api.user.setActivity('Chess and w!', {type: 'PLAYING'} );
        });
        
        this.api.on('message', msg => {
            if(msg.author.bot) return;
            if (msg.content.substring(0, 2) == 'w!') parseCommand(msg);
        });
    }

    log(msg: string) {
        console.log(msg);
        // TODO: log to #bot-log
    }
}
