import {Bot} from '../bot';
import {Logger} from '../utils/logger';
import {Utils} from '../utils/utils';
import {Command} from '../commands/command';
import {Test} from '../commands/test';
import {Help} from '../commands/help';
import {Events} from '../commands/events';
import {Invite} from '../commands/invite';
import {Jerome} from '../commands/jerome';
import {Members} from '../commands/members';
import {RandomOpening} from '../commands/randomopening';
import {RandomPuzzle} from '../commands/randompuzzle';
import {Status} from '../commands/status';
import {Uptime} from '../commands/uptime';
import {Version} from '../commands/version';
import {Message, TextChannel} from 'discord.js';
import {CommandChannels} from '../commands/mod/cc';
import {Announce} from '../commands/mod/announce';
import {CheckRoles} from '../commands/mod/checkroles';
import {Clear} from '../commands/mod/clear';
import {EventCommand} from '../commands/mod/event';
import {Notifications} from '../commands/mod/notifications';
import {Poll} from '../commands/mod/poll';
import {React} from '../commands/mod/react';
import {Remind} from '../commands/mod/remind';
import {Restart} from '../commands/mod/restart';
export namespace CommandService {
  function hasPermit(id: string): boolean {
    const permit: Bot.Permit = Bot.getPermit();
    return permit.permitted.includes(id);
  }

  export const commands: Array<Command> = [];

  export const commandChannels: string[] = [process.env.DEFCC];
  // TODO: move API async message function to bot.ts
  export async function registerCommands() {
    Bot.api.on('message', async (msg) => {
      Utils.reactRedditor(msg);
      if (msg.author.bot) return; // bots
      if (!Bot.isProd && !hasPermit(msg.author.id)) return; // dev bot
      if (!msg.guild || !(msg.channel instanceof TextChannel)) {
        msg.reply('Commands are only allowed in server Text Channels');
      } else if (msg.content.substring(0, 2) === Bot.PREFIX) {
        if (msg.guild.id===process.env.GUILD) {
          if (commandChannels.includes(msg.channel.id) ||
            hasPermit(msg.author.id)) {
            parseCommand(msg);
          } else {
            // TODO: fix this weird thing
            msg.react('❌');
            msg.reply('WCCB commands are only allowed at ' +
              'the relevant bot commands channels. ' +
              'Please contact <@!259464008262746113> ' +
              'if you believe this is an error.')
              .then((msg)=>{
                msg.delete({timeout: 5000});
              });
          }
        }
      } else {
        Utils.fInChat(msg);
      }
    });

    // COMMANDS
    commands.push(new Test());
    commands.push(new Events());
    commands.push(new Invite());
    commands.push(new Jerome());
    commands.push(new Members());
    commands.push(new RandomOpening());
    commands.push(new RandomPuzzle());
    commands.push(new Status());
    commands.push(new Uptime());
    commands.push(new Version());
    commands.push(new Help()); // Keep this in between
    commands.push(new Announce());
    // TODO: Command Manager (enable/disable commands)
    commands.push(new CommandChannels());
    commands.push(new CheckRoles());
    commands.push(new Clear());
    commands.push(new EventCommand()); // to avoid duplicate name
    commands.push(new Notifications());
    commands.push(new Poll());
    commands.push(new React());
    commands.push(new Remind());
    commands.push(new Restart());
    // Mod Commands (do not mix up or else the HELP command WILL break)
  }

  // TODO: Use reply to make more clear replies to incorrect command usages
  async function parseCommand(msg: Message) {
    Logger.log(
      `${msg.author.tag} executed \`${msg.content}\``);
    Utils.Counter.addProcessed();
    // TODO: Improve regex to support single and double quotes.
    const args = msg.content.slice(2).split(/ +/);
    const cmd = args.shift().toLowerCase();

    // forEach is too much of a bitch
    // commands.forEach((com) => {
    let foundCommand = false;
    for (const com of commands) {
      // TODO: command mapping using HashMap, etc
      // TODO: macro alias detection (all-caps)
      if (com.getAliases().includes(cmd)) {
        if (com.needsPermit() && hasPermit(msg.author.id)) {
          Logger.log('Permission denied from ID: ' + msg.author.id);
          break;
        }
        const res: boolean = await com.exec(msg, args);
        if (!res) {
          // incorrect usage
          msg.react('❌');
          msg.reply('**Incorrect command usage**');
        }
        foundCommand = true;
        // exit after parsing command
        break;
      }
    }
    // });
    if (!foundCommand) {
      msg.react('❌');
      msg.reply('**Command NOT found**');
    }
  }
}
