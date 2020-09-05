import {Message} from 'discord.js';
import {Command} from '../command';

export class EventCommand extends Command {
  needsPermit(): boolean {
    return true;
  }

  getAliases(): string[] {
    return ['event', 'evt'];
  }

  async exec(msg: Message, args: string[]): Promise<boolean> {
    switch (args[0]) {
    case 'create':
    case 'remove':
    }

    return true;
  }

  getHelp(): string {
    return 'WIP Manage events';
  }
}
