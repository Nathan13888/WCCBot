import {
  DMChannel,
  Message, MessageEmbed, NewsChannel, ReactionCollector, TextChannel,
} from 'discord.js';

class Page {
  public embed: MessageEmbed = undefined;
  public rendered: boolean = false;
}

// TODO: filter input (like `goto(-1)`)
export class Menu {
  // all menus should use the same reactions
  reactions = {
    first: '⏪',
    back: '◀',
    next: '▶',
    last: '⏩',
    stop: '⏹',
  }

  channel: TextChannel | DMChannel | NewsChannel;
  uid: string;
  size: number;
  time: number;
  fetcher: (pg: number) => MessageEmbed;

  msg: Message;
  collector: ReactionCollector;
  cur: number = 0;
  pages: Array<Page> = [];

  constructor(
    channel: TextChannel | DMChannel | NewsChannel,
    uid: string,
    size: number,
    fetcher: (pg: number) => MessageEmbed) {
    this.channel = channel;
    this.uid = uid;
    this.size = size;
    this.fetcher = fetcher;
    for (let x = 0; x < this.size; x++) {
      this.pages[x] = new Page();
      this.pages[x].embed = undefined;
      this.pages[x].rendered = false;
    }
  }

  send(time: number = 120000) {
    this.time = time;
    this.render(this.cur);
    this.render(1); // prerender next page
    this.channel.send(this.pages[this.cur]).then((msg) => {
      this.msg = msg;
      this.react();
      this.addCollector(this.uid);
    });
  }

  private addCollector(uid: string) {
    const collector = this.msg.createReactionCollector(
      (r, u) => u.id == uid, {time: this.time});
    this.collector = collector;
    collector.on('collect', (r) => {
      switch (r.emoji.name) {
      case this.reactions.first:
        this.goto(0);
        break;
      case this.reactions.back:
        this.goto(this.cur - 1);
        break;
      case this.reactions.next:
        this.goto(this.cur + 1);
        break;
      case this.reactions.last:
        this.goto(this.size - 1);
        break;
      case this.reactions.stop:
        collector.stop();
        break;
      default:
        // reacted with unknown emoji
      }
      r.users.remove(uid);
    });
    collector.on('end', () => {
      this.msg.reactions.removeAll();
      this.msg.react('❌'); // menu is invalid
    });
  }
  async react() {
    await this.msg.react(this.reactions.first);
    await this.msg.react(this.reactions.back);
    await this.msg.react(this.reactions.next);
    await this.msg.react(this.reactions.last);
    await this.msg.react(this.reactions.stop);
  }
  private async goto(pg: number) {
    if (pg >= 0 && pg < this.size) {
      await this.render(pg);
      this.render(pg+1);
      this.render(pg-1);
      this.cur = pg;
      this.msg.edit(this.pages[pg]);
    }
  }
  private async render(pg: number) {
    if (pg >= 0 && pg < this.size && !this.pages[pg].rendered) {
      const fetched = this.fetcher(pg);
      this.pages[pg].embed = fetched.setFooter(
        `${pg+1}/${this.size}`); // fetched.footer
      this.pages[pg].rendered = true;
    }
    // TODO: else
  }
}
