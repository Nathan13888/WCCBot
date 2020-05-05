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
<<<<<<< HEAD
=======

        this.api.login(this.discordToken);
>>>>>>> 4f0bf11112de97e34f742fff8a134048430b61fc
    }

    async init() {
        this.api.login(this.discordToken);

        this.api.on('ready', () => {
            this.log('WCC Bot has started!');
            this.log(`Connected as ${this.api.user.tag}`);
        });
        
        this.api.on('message', evt => { 
            if (evt.content.substring(0, 2) == 'w!') {
                const cmd = evt.content.substring(2).trim().toLowerCase();
                const args = cmd.split(' ');
            }
        });
    }

    log(msg: string) {
        console.log(msg);
        // TODO: log to #bot-log
    }
}
