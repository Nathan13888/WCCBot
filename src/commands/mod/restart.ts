import {Message} from 'discord.js';
import {Logger} from '../../utils/logger';
import {Command} from '../command';

export class Restart extends Command {
  needsPermit(): boolean {
    return true;
  }

  getAliases(): string[] {
    return ['restart', 'reboot', 'shutdown'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    // TODO: prompt confirm
    msg.react('👍');
    msg.reply('Restarting now...');
    Logger.log('Shutting down');
    process.exit();

    // return true;
  }

  getHelp(): string {
    return 'RESTARTS the bot';
  }
}
