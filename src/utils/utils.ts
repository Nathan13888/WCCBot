import { TextChannel } from 'discord.js';
import { Bot } from '../bot';
export namespace Utils {
    export function getRandCode(): string {
        let code: string = ""; const LETTERS = "ABCDE";
        code += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        code += Math.floor(Math.random() * 100) + 1;
        return code;
    }
    export function postOpening() {
        let url = 'https://www.365chess.com/eco/';
        url += getRandCode();
    }
    // Sends message to channel
    // TODO: make `cb` parameter strict
    export function sendMessage(msg: string, id: string, cb: Function) {
        const chan = Bot.api.channels.cache.get(id);
        if (chan.type == 'text') {
            (chan as TextChannel).send(msg).then(msg => cb(msg));
        }
    }
    export function testChannel(id: string, name: string) {
        const timeout: number = 5000;
        sendMessage('**TEST**: ' + name + ' Channel', id, msg => msg.delete({ timeout }));
    }
}