import { Config, ConfigT } from "../../config";
import { Database, PgDBT } from "../../db";

describe("Check create, initialize and destroy DB", () => {
  let config: ConfigT;
  let db: PgDBT;
  const _config = new Config("covid_test_");
  config = _config.createConfig();
  const pgdb = new Database(config.db_section);
  beforeAll(async () => {
    db = pgdb.createPgDB();
    await pgdb.initializePgDB(db);
  });

  test("Create Bot test", () => {
    const db = pgdb.createPgDB();

    expect(pgdb).toBeDefined();

    expect(db).toHaveProperty("db", expect.any(Object));
    expect(db).toHaveProperty("pgp", expect.any(Function));
  });

  afterAll(async () => {
    await pgdb.destroyPgDB(db);
  });
});
