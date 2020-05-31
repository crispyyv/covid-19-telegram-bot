const pgPromise = require("pg-promise"); // pg-promise core library
import { IInitOptions, IDatabase, IMain } from "pg-promise";
import { IExtensions, UsersRepository } from "./repos";
import {
  IConnectionParameters,
  IClient,
} from "pg-promise/typescript/pg-subset";

export type DBT = IDatabase<IExtensions> & IExtensions;
export type PgDBT = {
  db: DBT;
  pgp: IMain;
};

interface IDb {
  createPgDB(): PgDBT;
  initializePgDB(dbApp: PgDBT): void;
  destroyPgDB(dbApp: PgDBT): void;
}

export class Database implements IDb {
  config!: string | IConnectionParameters<IClient>;
  constructor(config: {}) {
    this.config = config;
  }
  createPgDB() {
    const initOptions: IInitOptions<IExtensions> = {
      extend(obj: DBT, dc: any) {
        obj.users = new UsersRepository(obj, pgp);
      },
    };

    const pgp: IMain = pgPromise(initOptions);

    const db: DBT = pgp(this.config);

    return { db, pgp };
  }
  async initializePgDB(dbApp: PgDBT) {
    await dbApp.db.users.create();
  }

  destroyPgDB(dbApp: PgDBT) {
    return dbApp.pgp.end();
  }
}
