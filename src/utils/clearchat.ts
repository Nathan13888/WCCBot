
// import {Bot} from '../bot';
import {Utils} from './utils';
import {Logger} from './logger';
// import * as pack from '../../package.json';
export namespace ClearChat {
    export function clearAll(id:string): void {
      // for (let i=0; i<10; i++) {
      Utils.getTextChannel(id).bulkDelete(100);
      // }
      log('ALL', id);
    }

    function log(s:string, id:string): void {
      Logger.log(`Cleared ${s} Messages at channel ID ${id}`);
    }
}
