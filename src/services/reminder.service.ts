import {CronJob} from 'cron';
import {Moment} from 'moment';
import {Bot} from '../bot';
import {
  MessageOptions, MessageAdditions, APIMessage,
  StringResolvable,
  User,
  MessageEmbed,
} from 'discord.js';
import {Logger} from '../utils/logger';

export namespace ReminderService {
  // TODO: Make reminders persistent by saving in database
  export async function setReminder(
    time: string | Date | Moment,
    message: StringResolvable | MessageOptions
      | (MessageOptions & { split?: false })
      | MessageAdditions | APIMessage,
    author: User,
  ) {
    new CronJob(time, async function() {
      sendReminder(message, author);
    }, null, true, 'America/Toronto');
    Logger.log(`Reminder set by ${author.tag} at ${time}` +
      `with message '${message}'`);
  }

  export async function sendReminder(
    message: StringResolvable | MessageOptions
      | (MessageOptions & { split?: false })
      | MessageAdditions | APIMessage,
    author: User,
  ) {
    const reminderEmbed = new MessageEmbed()
      // .setAuthor(author.tag)
      .setColor(0xd62320)
      // .setTitle(message)
      .setDescription(message)
      .setFooter(author.tag, author.avatarURL());
    Bot.reminderChannel.send(reminderEmbed);

    Logger.log(`Reminder sent by ${author.tag}: ${message}`);
  }
}
