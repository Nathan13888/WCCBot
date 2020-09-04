import {Message} from 'discord.js';

export class Command {
  aliases: string[];

  needsPermit(): boolean {
    return false;
  }

  getAliases(): string[] {
    // Return empty list
    return [];
  }

  // Returning FALSE means that the command errored out
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exec(msg: Message, args: string[]): boolean {
    // Command not found...
    return false;
  }

  getHelp(): string {
    return 'This Command does not have a specified help message.';
  }
}
