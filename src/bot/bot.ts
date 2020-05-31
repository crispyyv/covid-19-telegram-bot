import { CustomCommands } from "./commands/custom";
import { UserStatsEnum } from "./../db/models/userModels";
import Telegraf, { Context } from "telegraf";
import { ConfigT } from "../config";
import { DBT } from "../db";
import { TelegrafContext } from "telegraf/typings/context";
import { StandartCommands } from "./commands";
import { BotCommandEnum } from "./commands/commands";

export type TlgfCtxT = Context & {
  db: DBT;
};

interface IBot {
  bot: Telegraf<TelegrafContext>;
  dataBase: DBT;
  config: ConfigT;
  commands: StandartCommands;
  custCommands: CustomCommands;
}

export class InittializeBot implements IBot {
  constructor(dataBase: DBT, config: ConfigT) {
    this.bot = new Telegraf(config.bot_section.bot_token);
    this.commands = new StandartCommands();
    this.custCommands = new CustomCommands();
    this.dataBase = dataBase;
    this.config = config;
  }
  bot: Telegraf<TelegrafContext>;
  dataBase: DBT;
  config: ConfigT;
  commands: StandartCommands;
  custCommands: CustomCommands;

  private help() {
    this.bot.command(
      this.commands.getCmdStr(BotCommandEnum.help),
      <any>this.commands.helpHandler
    );
  }

  private settings() {
    this.bot.command(
      this.commands.getCmdStr(BotCommandEnum.settings),
      <any>this.commands.settingsHandler
    );
  }

  private fetch() {
    this.bot.command(
      this.commands.getCmdStr(BotCommandEnum.country),
      <any>this.custCommands.countries
    );
  }

  private ukraine() {
    this.bot.action("ukraine", (ctx) => {
      const newCtx = <TlgfCtxT>ctx;
      return this.custCommands.useCountry(newCtx, "ukraine");
    });
  }

  start() {
    this.bot.use((ctx, next) => {
      const newCtx = <TlgfCtxT>ctx;
      newCtx.db = this.dataBase;
      return next && next();
    });
    this.bot.command(
      this.commands.getCmdStr(BotCommandEnum.start),
      <any>this.commands.startHandler
    );
    this.help();
    this.settings();
    this.fetch();
    this.ukraine();
    this.bot.launch();
  }

  stop() {
    return this.bot.stop();
  }
}
