import Telegraf from "telegraf";
import { Context, session, Stage } from "telegraf";
import { ConfigT } from "../config";
import { DBT } from "../db";
import { TelegrafContext } from "telegraf/typings/context";
import { StandartCommands } from "./commands";
import { BotCommandEnum } from "./commands/commands";
import { Scenes } from "./scenes";
import { SceneContextMessageUpdate, BaseScene } from "telegraf/typings/stage";

const { enter, leave } = Stage;

export type TlgfCtxT = Context & {
  db: DBT;
};

interface IBot {
  bot: Telegraf<TelegrafContext>;
  dataBase: DBT;
  config: ConfigT;
  commands: StandartCommands;
}

export class InittializeBot implements IBot {
  stage: Stage<SceneContextMessageUpdate>;
  country: BaseScene<SceneContextMessageUpdate>;
  constructor(dataBase: DBT, config: ConfigT) {
    this.bot = new Telegraf(config.bot_section.bot_token);

    this.commands = new StandartCommands();
    this.scenes = new Scenes();
    this.dataBase = dataBase;
    this.config = config;
    this.country = this.scenes.countryScene();
    this.stage = new Stage([this.country]);
  }
  bot: Telegraf<TelegrafContext>;
  dataBase: DBT;
  config: ConfigT;
  commands: StandartCommands;
  scenes: Scenes;

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

  start() {
    this.bot.use((ctx, next) => {
      const newCtx = <TlgfCtxT>ctx;
      newCtx.db = this.dataBase;
      return next && next();
    });

    this.bot.use(session());
    //@ts-ignore-start
    this.bot.use(this.stage.middleware());
    //@ts-ignore-end
    this.bot.command(
      this.commands.getCmdStr(BotCommandEnum.start),
      <any>this.commands.startHandler
    );
    this.bot.command("country", async (ctx) => {
      //@ts-ignore-start
      ctx.scene.enter("country");
      //@ts-ignore-end
    });
    this.bot.action("country", (ctx: TelegrafContext) => {
      //@ts-ignore
      ctx.scene.enter("country");
    });
    this.help();
    this.settings();
    this.bot.launch();
  }

  stop() {
    return this.bot.stop();
  }
}
