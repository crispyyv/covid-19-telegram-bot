import { Database } from "../db";
import { InittializeBot } from "../bot";
import { Config } from "../config";

test("Simple test", () => {
  const _config = new Config("covid_test_");
  const config = _config.createConfig();

  const pgdb = new Database(config.db_section);
  const db = pgdb.createPgDB();

  const bot = new InittializeBot(db.db, config);

  expect(true).toBe(true);
});
