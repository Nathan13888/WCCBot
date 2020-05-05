import * as Discord from 'discord.js';

export class Bot {
    api: Discord.Client;
    private discordToken: string;

    constructor() {
        this.api = new Discord.Client();
        if (process.env.DISCORD_TOKEN)
            this.discordToken = process.env.DISCORD_TOKEN;
        else throw new Error('Discord token needed.');

        this.init();
    }

    init() {
        this.api.login(this.discordToken);

        this.api.on('ready', () => {
            this.log('WCC Bot has started!');
            this.log(`Connected as ${this.api.user.tag}`);
        });
        
        this.api.on('message', msg => { 
            if (msg.content.substring(0, 2) == 'w!') {
                const cmd = msg.content.substring(2).trim().toLowerCase();
                const args = cmd.split(' ');
            }
        });
    }

    log(msg: string) {
        console.log(msg);
        // TODO: log to #bot-log
    }
}
