import * as Discord from 'discord.js';

export function parseCommand(message: Discord.Message) {
    const cmd = message.content.substring(2).trim().toLowerCase();
    const args = cmd.split(' ');
}
