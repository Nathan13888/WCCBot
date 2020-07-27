import { MessageEmbed, TextChannel } from 'discord.js';
import { Bot } from '../bot';
export namespace Utils {
    export function getRandCode(): string {
        let code: string = ''; const LETTERS = 'ABCDE';
        code += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
        const num = Math.floor(Math.random() * 99) + 1;
        if (num < 10)
            code += "0";
        code += num;
        return code;
    }
    export function postOpening() {
        let url = 'https://www.365chess.com/eco/';
        const code = getRandCode();
        const name = '';
        const desc = '';
        url += code;
        const logo = 'https://woodlandschessclub.netlify.app/assets/img/logo-gold-black-512.png';

        const embed = new MessageEmbed().setColor('#00FA9A') // chess green
            .setTitle('Daily Opening')
            .setURL(url)
            .setAuthor('WCCB', logo)
            .setDescription(desc)
            // .setThumbnail(logo)
            .addFields(
                { name: name, value: url },
                // { name: '\u200B', value: '\u200B' },
                // { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .setTimestamp()

        getTextChannel(process.env.OPEN).send(embed);
    }
    export function getTextChannel(id: string): TextChannel {
        const chan = Bot.api.channels.cache.get(id);
        if (chan.type == 'text')
            return (chan as TextChannel);
        else return undefined;
    }
    // Sends message to channel
    // TODO: make `cb` parameter strict
    export function sendMessage(msg: string, id: string, cb: Function) {
        const chan = getTextChannel(id);
        chan.send(msg).then(msg => cb(msg));
    }
    export function testChannel(id: string, name: string) {
        const timeout: number = 5000;
        sendMessage('**TEST**: ' + name + ' Channel', id, msg => msg.delete({ timeout }));
    }
}