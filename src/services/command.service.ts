import {Bot} from '../bot';
import {Logger} from '../utils/logger';
import {Utils} from '../utils/utils';
import {Command} from '../commands/command';
import {Test} from '../commands/mod/test';
import {Help} from '../commands/help';
import {Events} from '../commands/events';
import {Invite} from '../commands/invite';
import {Members} from '../commands/members';
import {RandomOpening} from '../commands/randomopening';
import {RandomPuzzle} from '../commands/randompuzzle';
import {Status} from '../commands/status';
import {Uptime} from '../commands/uptime';
import {Version} from '../commands/version';
import {Message} from 'discord.js';
import {CommandChannels} from '../commands/mod/cc';
import {CheckRoles} from '../commands/mod/checkroles';
import {Clear} from '../commands/mod/clear';
import {EventCommand} from '../commands/mod/event';
import {Notifications} from '../commands/mod/notifications';
import {Poll} from '../commands/mod/poll';
import {React} from '../commands/mod/react';
import {Restart} from '../commands/mod/restart';
import {Unsubcribe} from '../commands/unsub';
import {Subscribe} from '../commands/sub';
import {Config} from '../config';
import {Counter} from './counter.service';
import {Lookup} from '../commands/lookup';
import {Announce} from '../commands/mod/announce';
import {Verify} from '../commands/verify';
import {ListRoles} from '../commands/mod/listroles';
import {Whois} from '../commands/mod/whois';
export namespace CommandService {
  export function hasPermit(id: string): boolean {
    const permit: Config.Permit = Config.getPermit();
    return permit.permitted.includes(id);
  }

  export const commands: Array<Command> = [];

  export const commandChannels: string[] = [Config.Channels.defCommandChannel];
  export async function registerCommands() {
    // TODO: add command cooldown
    Bot.api.on('message', async (msg) => {
      Utils.reactRedditor(msg);
      if (msg.author.bot) return; // bots
      if (!Config.isProd && !hasPermit(msg.author.id)) return; // dev bot
      /* if (!msg.guild || !(msg.channel instanceof TextChannel)) {
        msg.reply('Commands are only allowed in server Text Channels');
      } else */if (msg.content.substring(0, 2) === Config.PREFIX) {
        if (msg.guild.id===Config.GUILD) {
          if (commandChannels.includes(msg.channel.id) ||
            hasPermit(msg.author.id)) {
            parseCommand(msg);
          } else {
            // TODO: fix this weird thing
            msg.react('❌');
            const s = 'WCCB commands are only allowed at ' +
            'the relevant bot commands channels. ' +
            'Please contact <@!259464008262746113> ' +
            'if you believe this is an error.';
            msg.reply(Utils.getDefEmbed()
              .setTitle('Allowed Command Channels.')
              .setDescription(s))
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
    // commands.push(new ());
    commands.push(new Verify());
    commands.push(new Status());
    commands.push(new Version());
    commands.push(new Uptime());
    commands.push(new Members());
    commands.push(new Events());
    commands.push(new Invite());
    // commands.push(new Jerome());
    commands.push(new RandomOpening());
    commands.push(new RandomPuzzle());
    commands.push(new Subscribe());
    commands.push(new Unsubcribe());
    commands.push(new Lookup());
    commands.push(new Help()); // Keep this in between
    // TODO: Command Manager (enable/disable commands)
    commands.push(new Restart());
    commands.push(new ListRoles());
    commands.push(new Poll());
    commands.push(new Test());
    commands.push(new EventCommand()); // to avoid duplicate name
    commands.push(new CommandChannels());
    commands.push(new CheckRoles());
    commands.push(new Clear());
    commands.push(new Notifications());
    commands.push(new React());
    // commands.push(new Remind());
    commands.push(new Announce());
    commands.push(new Whois());
    // Mod Commands (do not mix up or else the HELP command WILL break)
  }

  export function findCommand(cmd: string): Command {
    // TODO: command mapping using HashMap, etc
    // TODO: macro alias detection (all-caps)
    for (const com of commands) {
      if (com.getAliases().includes(cmd)) {
        return com;
      }
    }
    return undefined;
  }

  // TODO: Use reply to make more clear replies to incorrect command usages
  async function parseCommand(msg: Message) {
    Logger.log(
      `${msg.author.tag} executed \`${msg.content}\``);
    Counter.addProcessed();
    // TODO: Improve regex to support single and double quotes.
    const args = msg.content.slice(2).split(/ +/);
    const cmd = args.shift().toLowerCase();

    const com = findCommand(cmd);
    if (com) {
      if (com.needsPermit() && !hasPermit(msg.author.id)) {
        Logger.log('Permission denied from ID: ' + msg.author.id);
      } else {
        const res: boolean = await com.exec(msg, args);
        if (!res) {
        // incorrect usage
          msg.react('❌');
          msg.reply('**Incorrect command usage**');
        }
        return;
      }
    }
    msg.react('❌');
    msg.reply('**Command NOT found**');
  }
}
