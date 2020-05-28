import { UserStatsEnum } from "./../db/models/userModels";
import Telegraf from "telegraf";
import { getConfig, ConfigT } from "../config";
import { Database, DBT } from "../db";
import { TelegrafContext } from "telegraf/typings/context";

const dbConfig = {
  host: "localhost",
  port: 5432,
  database: "tg-bot-test",
  user: "vladyslav",
  password: "19680401",
};

interface IBot {
  bot: Telegraf<TelegrafContext>;
  dataBase: DBT;
  config: ConfigT;
}

export class InittializeBot implements IBot {
  constructor(dataBase: DBT, config: ConfigT) {
    this.bot = new Telegraf(config.bot_section.bot_token);
    this.dataBase = dataBase;
    this.config = config;
  }
  bot: Telegraf<TelegrafContext>;
  dataBase: DBT;
  config: ConfigT;

  start() {
    this.bot.start(async (ctx) => {
      if (ctx.from) {
        const { id, first_name, username } = ctx.from;

        const idStr = String(id);

        const dbUser = await this.dataBase.users.findById(idStr);
        if (dbUser) {
          return ctx.reply(`You'r already registred! ${dbUser.first_name}`);
        }
        const createdDBUser = await this.dataBase.users.add({
          id: idStr,
          status: UserStatsEnum.registered,
          first_name,
          username,
        });
        ctx.reply(
          `I love you baby!!! Thanks for being there,  ${createdDBUser.first_name}`
        );
      }
    });
    this.bot.launch();
  }
}

const config = getConfig("covid_test_");
const pgdb = new Database(dbConfig);
const db = pgdb.createPgDB();

const bot = new InittializeBot(db.db, config);
bot.start();
