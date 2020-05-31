import { Database } from "./db";
import { InittializeBot } from "./bot";
import { Config } from "./config";
import { FooError } from "./error";



async function run(){
    const _config = new Config("covid_test_");
    const config = _config.createConfig();
    
    const pgdb = new Database(config.db_section);
    const db = pgdb.createPgDB();
    await pgdb.initializePgDB(db)
    const bot = new InittializeBot(db.db, config);
    bot.start();
}

run().catch(err=>{
    new FooError(`\n-----------------------\n\nSomething get wrong. See error log \n\n-----------------------\n ${err.message}`).throwError
    process.exit(1)
})