import * as Discord from 'discord.js';

export class Bot {
    client: Discord.Client;
    private discordToken: string;
    constructor() {
        this.client = new Discord.Client();
        if (process.env.DISCORD_TOKEN)
            this.discordToken = process.env.DISCORD_TOKEN;
        else throw new Error('Discord token needed.');

        this.init();
    }

    async init() {
        this.client.on('ready', () => {
            console.log('WCC Bot has started!');
        });
        
        this.client.login(this.discordToken);
    }
}
