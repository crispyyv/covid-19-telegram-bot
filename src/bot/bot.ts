import Telegraf from "telegraf";

import { getConfig } from "../config/config";

const config = getConfig("covid_test_");
const bot = new Telegraf(config.bot_section.bot_token);
bot.start((ctx) => ctx.reply("Welcom to covid-19 bot"));
bot.launch();
