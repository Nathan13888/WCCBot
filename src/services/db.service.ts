import Mongoose = require('mongoose');
import {getModelForClass, prop} from '@typegoose/typegoose';
import {Logger} from '../utils/logger';
import {Config} from '../config';

export namespace DB {
  let db: Mongoose.Connection;
  export class EventClass {
    @prop({required: true, trim: true})
    title: string; // title of event
    @prop({required: true, trim: true})
    desc: string; // desc of event
    @prop({required: true})
    author: string; // id of person who made the event
    @prop({required: true})
    date: Date; // the time of the event
    @prop({required: true, default: new Date()})
    created: Date; // the time it was created
    @prop({required: true, default: false})
    deleted: boolean;
  }
  export class UserClass {
    @prop({required: true, trim: true})
    userid: string;
    @prop({required: true, trim: true})
    fullname: string;
    @prop({required: true, trim: true})
    grade: string;
    @prop({required: true, trim: true})
    SN: string;
    @prop({required: false, trim: true})
    lichess: string;
    @prop({required: false, trim: true})
    chesscom: string;
  }
  export class LogClass {
    @prop({required: true})
    time: Date;
    @prop({required: true})
    contents: string;
    @prop({required: true})
    version: string;
  }
  export const Event = getModelForClass(EventClass);
  export const User = getModelForClass(UserClass, {
    existingMongoose: Mongoose,
    schemaOptions: {collection: 'users'},
  });
  export const Log = getModelForClass(LogClass, {
    existingMongoose: Mongoose,
    schemaOptions: {collection: 'logs'},
  });
  export function init() {
    // connect to MongoDB
    // TODO: log number of events found
    (async () => {
      try {
        Logger.log('Attempting to connect to DB');
        await Mongoose.connect(Config.DB.DBURI, {
          useNewUrlParser: true,
          useFindAndModify: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          serverSelectionTimeoutMS: 5000,
          dbName: 'WCCBot',
        }).catch((err) => console.log(err.reason));
      } catch (err) {
        Logger.log(err);
      }
    })();
    // db.once('open', () => {
    //   Logger.log('Connected to MongoDB');
    // });
    // db.on('error', (err) => {
    //   Logger.log(err);
    // });
  }
  export async function DBLog(contents: string): Promise<boolean> {
    const log = new Log({
      time: new Date(),
      contents: contents,
      version: Config.getVersion(),
    } as LogClass);
    log.save((err) => {
      if (err) return false;
    });
    return true;
  }
  export function getStatus(): string {
    return 'Coming Soon';
  }
  export function disconnect() {
    if (!db) {
      return;
    }
    Mongoose.disconnect();
  }

  export function addEvent(title: string, desc: string,
    author: string, date: Date): void {
    const event = new Event({
      title: title,
      desc: desc,
      author: author,
      date: date,
    } as EventClass);
    event.save((err, event) => {
      if (err) Logger.err(err);
      Logger.log('[DB] Saved event with _id:' + event._id);
    });
  }
  export function addUser(userid: string, fullname: string, grade: string,
    SN: string, lichess?: string, chesscom?: string): void {
    const user = new User({
      userid: userid,
      fullname: fullname,
      grade: grade,
      SN: SN,
      lichess: lichess,
      chesscom: chesscom,
    } as UserClass);
    user.save((err, user) => {
      if (err) Logger.err(err);
      Logger.log('[DB] Saved user with _id:' + user._id);
    });
  }
  // export function removeEvent(_id: string): void {

  // }
  export function addExample(): void {
    addEvent('Example Event', 'This is the description.',
      'somediscordIDhere', new Date(new Date().getTime() + (1000*60*60*24)));
  }
  export async function findbyUserID(userid: string): Promise<UserClass> {
    return await User.findOne({'userid': userid}).exec();
  }
  // TODO: edit --> removes and adds a new version
}
