import { Bot } from '../bot';
export namespace Logger {
    export function log(msg: string) {
        console.log(msg);
        const channel = Bot.api.channels.cache.get(process.env.LOG);
        channel.send(msg);
    }
}
