import {TextChannel} from 'discord.js';
import {Bot} from '../bot';

export namespace Logger {
    export async function log(msg: string) {
      const log = `${new Date().toISOString()} ${msg}`;
      console.log(log);
      const channel = Bot.api.channels.cache.get(process.env.LOG);
      if (channel) {
        if (channel.type == 'text') {
          (channel as TextChannel).send(msg);
        }
      } else {
        console.log('LOGGING CHANNEL NOT FOUND');
      }
    }
    export async function err(msg: string) {
      console.error(msg);
    }
}
