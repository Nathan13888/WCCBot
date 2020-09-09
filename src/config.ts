import {Logger} from './utils/logger';
import * as fetch from 'node-fetch';

export namespace Config {

  const ENV = process.env;

  // set prefix
  export let PREFIX: string;

  export function init(): void {
    const envPrefix = ENV.PREFIX; // prefix override
    if (envPrefix) {
      PREFIX = envPrefix;
    } else if (Config.isProd) {
      PREFIX = '::';
    } else {
      PREFIX = '""';
    }
    // TODO: improve fetching mechanism
    fetch(ENV.PERMIT, {method: 'Get'}).then((res: any) => res.json())
      .then((json: Permit) => {
        permit = json;
      });
  }

  export const inviteLink: string = 'https://discord.gg/tctG7mA';

  export interface Permit {
    permitted: Array<string>,
  }

  const defPermit: Permit = {
    'permitted': [
      '259464008262746113',
      '269220748730695681',
    ],
  };
  let permit: Permit = undefined;

  export function getPermit(): Permit {
    if (permit == undefined) {
      const message = 'PERMIT IS MISSING ! ! !';
      Logger.log(message);
      // throw new Error(message);
      return defPermit;
    }
    return permit;
  }

  export const NODE_ENV: string = ENV.NODE_ENV;
  export const isProd: boolean = NODE_ENV==='production';
  export const TOKEN: string = ENV.DISCORD_TOKEN;
  export const GUILD: string = ENV.GUILD;
  export const logIP: boolean = ENV.IP==='true';

  export namespace Channels {
    export const announcements = ENV.ANN;
    export const polls = ENV.POLL;
    export const openings = ENV.OPEN;
    export const puzzles = ENV.PUZZ;
    export const logs = ENV.LOG;
    export const defCommandChannel = ENV.DEFCC;
  }
  export namespace DB {
    export const DBURI = ENV.DBURI;
    export const USEDB = ENV.USEDB;
  }
  export namespace ID {
    export const DEFROLE = ENV.DEFROLE;
    export const ICS = ENV.ICSR;
    export const SUB = ENV.SUBR;
    export const VER = ENV.VERR;
    export const KNIGHT = '704343375893233704';
    export const REDDITOR = ENV.REDDITOR;
  }

  // VERSION
  const version = require('../package.json').version;
  export function getVersion(): string {
    return `${version} (${NODE_ENV})`;
  }
}
