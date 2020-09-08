import {Message} from 'discord.js';
import {Config} from '../../config';
import {CommandService} from '../../services/command.service';
import {Command} from '../command';

export class CommandChannels extends Command {
  needsPermit(): boolean {
    return true;
  }

  getAliases(): string[] {
    return ['cc', 'CC'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    if (args[0] == 'add') {
      CommandService.commandChannels.push(msg.channel.id);
      // TODO: fix this weird thing as well
      msg.reply('This channel has been added to the list of ' +
        'channels accepting commands.');
    } else if (args[0] == 'reset') {
      if (CommandService.commandChannels.includes(msg.channel.id)) {
        msg.reply('Reseting list of Command Channels');
        while (CommandService.commandChannels.length) {
          CommandService.commandChannels.pop();
        }
        CommandService.commandChannels.push(Config.Channels.defCommandChannel);
      }
    } else if (args[0] == 'remove') {
    // TODO: check if ID exists, remove ID from list
    } else if (args[0] == 'list') {
      let message: string = '';
      for (const cc of CommandService.commandChannels) {
        message += cc;
        message += ' ';
      }
      msg.reply(message);
    } else {
      return false;
    }

    return true;
  }

  getHelp(): string {
    return 'Change "command channel" settings';
  }
}
