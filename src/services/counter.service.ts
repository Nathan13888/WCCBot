import {Config} from '../config';
import countapi from 'countapi-js';
import {Logger} from '../utils/logger';

export namespace Counter {
  interface Result {
    status: number,
    path: string,
    value: number
  };
  const namespace = 'wccbot1';
  let starts = 0;
  let commands = 0;
  let alltime = 0;
  export function init(): void {
    addStarts();
    try {
      countapi.get(namespace, 'starts')
        .then((res: Result) => starts = res.value);
      countapi.get(namespace, 'commands')
        .then((res: Result) => alltime = res.value);
    } catch (err) {
      Logger.log('Encountered a problem with CountAPI');
    }
    // Logger.log(`Total Restarts: ${getStarts()}`);
    // Logger.log(`Total Commands Processed: ${getAlltime()}`);
  }
  export function addStarts(): void {
    if (Config.isProd) {
      countapi.hit(namespace, 'starts');
    } else {
      Logger.log('NOT COUNTING RESTART! (in dev mode)');
    }
  }
  export function addProcessed(): void {
    commands++;
    alltime++;
    countapi.hit(namespace, 'commands');
  }
  export function getStarts(): number {
    return starts;
  }
  export function getProcessed(): number {
    return commands;
  }
  export function getAlltime(): number {
    return alltime;
  }
}
