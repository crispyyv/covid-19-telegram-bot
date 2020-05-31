import { Config, ConfigT } from "../../config";
import { InittializeBot } from "..";
import { DBT } from "../../db";

describe("Check create, initialize and destroy bot", () => {
  let config: ConfigT;
  const _config = new Config("covid_test_");
  let bot: InittializeBot;

  beforeAll(async () => {
    config = _config.createConfig();
    bot = new InittializeBot(<DBT>{}, config);
    await bot.start();
  });

  test("Create Bot test", () => {
    expect(bot).toBeDefined();
    expect(bot).toHaveProperty("start", expect.any(Function));
  });

  afterAll(async () => {
    await bot.stop();
  });
});
