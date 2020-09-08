import {
  APIMessage, DMChannel,
  MessageAdditions,
  MessageOptions, NewsChannel,
  StringResolvable, TextChannel,
  User,
} from 'discord.js';

export namespace Prompt {
  export async function confirm(msg: string,
    channel: TextChannel | DMChannel | NewsChannel,
    user: User, cleanup: boolean = false): Promise<boolean> {
    const res = await input(`${msg} (yes/no)`, channel, user, 60000, cleanup);
    // TODO: custom response
    return (res && res.toLowerCase() === 'yes' ? true : false);
  }

  export async function input(
    question: StringResolvable | MessageOptions
      | (MessageOptions & { split?: false })
      | MessageAdditions | APIMessage,
    channel: TextChannel | DMChannel | NewsChannel,
    user: User,
    timeLimit?: number,
    cleanup: boolean = false,
  ): Promise<string> {
    let input: string;
    await channel.send(question).then(async (evt) => {
      if (!timeLimit) timeLimit = 60000;
      const filter = (msg) => user.id === msg.author.id;
      await channel.awaitMessages(filter, {
        time: timeLimit, max: 1, errors: ['time'],
      }).then((messages) => {
        input = messages.first().content;
        if (cleanup) messages.first().delete({timeout: 1000});
        channel.send(
          `You've entered: ${input}`,
        ).then((msg) => {
          if (cleanup) msg.delete({timeout: 1000});
        });
      }) .catch(() => {
        channel.send('You did not enter any input!').then((msg) => {
          if (cleanup) msg.delete({timeout: 10000});
        });
      });
      if (cleanup) evt.delete({timeout: 1000});
    });
    return input;
  }
}
