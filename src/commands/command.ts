import {Message} from 'discord.js';

export class Command {
  needsPermit(): boolean {
    return false;
  }

  getAliases(): string[] {
    // Return empty list
    return [];
  }

  // Returning FALSE means that the command errored out
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async exec(msg: Message, args: string[]): Promise<boolean> {
    // Command not found...
    return false;
  }

  getHelp(): string {
    return 'This Command does not have a specified help message.';
  }
}
