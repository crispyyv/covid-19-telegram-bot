import { Database } from "./db";
import { InittializeBot } from "./bot";
import { Config } from "./config";

const _config = new Config("covid_test_");
const config = _config.createConfig();

const pgdb = new Database(config.db_section);
const db = pgdb.createPgDB();

const bot = new InittializeBot(db.db, config);
bot.start();
