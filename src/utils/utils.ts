import { TextChannel } from 'discord.js';
import { Bot } from '../bot';
export namespace Utils {
    export function getRandCode(): string {
        let code: string = ""; const LETTERS = "ABCDE";
        code += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        code += Math.floor(Math.random() * 100) + 1;
        return code;
    }
    export function testChannel(id: string, name: string) {
        const timeout: number = 5000;
        const chan = Bot.api.channels.cache.get(id);
        if (chan.type == 'text') {
            (chan as TextChannel).send('**TEST**: ' + name + ' Channel').then(msg => msg.delete({ timeout }));
        }
    }
}