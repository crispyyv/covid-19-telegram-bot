import rc from "rc";

export type InitialDBT = {
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
};

export type DBConfigT = Pick<InitialDBT, Exclude<keyof InitialDBT, "port">> & {
  port: number;
};

export type ConfigT = {
  bot_section: {
    bot_token: string;
  };
  db_section: DBConfigT;
};

abstract class AConfig {
  constructor(protected fileName: string) {}

  // abstract toNumber(futureNumber: string): number;

  // abstract parseDBconfig(dbConfig: InitialDBT): DBConfigT;

  // abstract getConfig(): ConfigT;

  abstract createConfig(): ConfigT;
}

export class Config extends AConfig {
  constructor(fileName: string) {
    super(fileName);
  }

  private toNumber(futureNumber: string): number {
    let _number;
    try {
      _number = Number.parseInt(futureNumber);
    } catch (err) {
      throw err;
    } finally {
      if (_number !== undefined && Number.isNaN(_number)) {
        throw new Error(
          `Cant convert ${futureNumber} to Integer/Number. Result is ${_number}`
        );
      }
    }
    return _number;
  }
  private parseDBconfig(dbConfig: InitialDBT): DBConfigT {
    const port = this.toNumber(dbConfig.port);
    return {
      ...dbConfig,
      port,
    };
  }
  private getConfig(): ConfigT {
    const config = rc(this.fileName);
    if (!config) {
      throw new Error(`Config by name ${name} not found`);
    }

    const dbConfig = this.parseDBconfig(config.db_section);

    return { bot_section: config.bot_section, db_section: dbConfig };
  }
  public createConfig(): ConfigT {
    const config = this.getConfig();
    return config;
  }
}
