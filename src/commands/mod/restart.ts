import {Message} from 'discord.js';
import {Prompt} from '../../services/prompt.service';
import {Logger} from '../../utils/logger';
import {Utils} from '../../utils/utils';
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
    const confirm = await Prompt.confirm(
      'Are you sure you want to restart the bot?',
      msg.channel, msg.author);
    if (confirm) {
      msg.react('👍');
      msg.reply('Restarting in 5 seconds...');
      Logger.log('Shutting down');
      await Utils.delay(5000);
      process.exit();
    } else {
      msg.reply('Reboot aborted.');
    }

    return true;
  }

  getHelp(): string {
    return 'RESTARTS the bot';
  }
}
