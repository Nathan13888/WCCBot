import { TextChannel } from "discord.js";
import { Bot } from "../bot";

export namespace Logger {
    export async function log(msg: string) {
        console.log(msg);
        let channel = Bot.api.channels.cache.get(process.env.LOG);
        if(channel.type == "text")
            (channel as TextChannel).send(msg);
    }
}
