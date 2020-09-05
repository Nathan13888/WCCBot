import {Message} from 'discord.js';
import {CronService} from '../../services/cron.service';
import {Prompt} from '../../services/prompt.service';
import {Command} from '../command';

export class Remind extends Command {
  needsPermit(): boolean {
    return true;
  }

  getAliases(): string[] {
    return ['remind'];
  }

  dateRegex = new RegExp([
    '(\\d{1,4}) +(0\\d|1[0-2]) +(0\\d|[12]\\d|3[01]) +',
    '([01]\\d|2[0-3]) +([0-5]\\d)( +[0-5]\\d)?',
  ].join(''));

  async exec(msg: Message, args: string[]): Promise<boolean> {
    if (args && args.length) {
      if (args.length > 1) {
        msg.channel.send('Too many arguments!');
        return;
      }
      if (args[0].toLowerCase() === 'now') {
        const content = await Prompt.input(
          'What is the message of the reminder?',
          msg.channel, msg.author);
        if (!content) {
          msg.channel.send('Timed out. Please try again.');
          return;
        }
        CronService.sendReminder(content, msg.author);
      } else {
        msg.channel.send('Invalid time argument.');
      }
    } else {
      const content = await Prompt.input(
        'What is the message of the reminder?',
        msg.channel, msg.author);
      if (!content) {
        msg.channel.send('Timed out. Please try again.');
        return;
      }
      const date = await Prompt.input(
        'Enter the date (YYYY MM DD hh mm ss)',
        msg.channel, msg.author);
      if (!date) {
        msg.channel.send('Timed out. Please try again.');
        return;
      }
      const match = this.dateRegex.exec(date);
      if (match) {
        const dateObj = new Date(
          parseInt(match[1]),
          parseInt(match[2]) - 1,
          parseInt(match[3]),
          parseInt(match[4]),
          parseInt(match[5]),
          match[6] ? parseInt(match[6]) : 0,
        );
        CronService.setReminder(dateObj, content, msg.author);
        msg.channel.send('Reminder is set.');
      } else {
        msg.channel.send('Invalid date format.');
        return;
      }
    }

    return true;
  }

  getHelp(): string {
    return 'WIP Send reminders';
  }
}
