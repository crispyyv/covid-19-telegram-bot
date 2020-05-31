import { TlgfCtxT } from "..";

export enum BotCommandEnum {
  start = 1,
  settings,
  help,
  country,
}

export class Commands {
  getCmdStr(key: BotCommandEnum, append: boolean = true) {
    const cmdStr = BotCommandEnum[key];
    return append ? `/${cmdStr}` : cmdStr;
  }
}
