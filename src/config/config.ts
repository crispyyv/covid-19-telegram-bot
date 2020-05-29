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
function toNumber(futureNumber: string): number {
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

function parseDBconfig(dbConfig: InitialDBT) {
  const port = toNumber(dbConfig.port);
  return {
    ...dbConfig,
    port,
  };
}

export function getConfig(name: string): ConfigT {
  const config = rc(name);
  if (!config) {
    throw new Error(`Config by name ${name} not found`);
  }

  const dbConfig = parseDBconfig(config.db_section);

  return { bot_section: config.bot_section, db_section: dbConfig };
}

abstract class AConfig {
  constructor(
    protected fileName: string,
    protected futureNumber: string,
    protected dbConfig: InitialDBT
  ) {}

  abstract toNumber(futureNumber: string): number;

  abstract parseDBconfig(dbConfig: InitialDBT): {};

  abstract getConfig(fileName: string): ConfigT;
}

export class Config extends AConfig {
  constructor(fileName: string, futureNumber: string, dbConfig: InitialDBT) {
    super(fileName, futureNumber, dbConfig);
  }

  public toNumber(futureNumber: string): number {
    let _number;
  try {
    _number = Number.parseInt(this.futureNumber);
  } catch (err) {
    throw err;
  } finally {
    if (_number !== undefined && Number.isNaN(_number)) {
      throw new Error(
        `Cant convert ${this.futureNumber} to Integer/Number. Result is ${_number}`
      );
    }
  }
  return _number;
  }
  public parseDBconfig(dbConfig: InitialDBT) {
    const port = this.toNumber(this.dbConfig.port);
  return {
    ...this.dbConfig,
    port,
  };
  }
  public getConfig(fileName: string): ConfigT {
    const config = rc(this.fileName);
    if (!config) {
      throw new Error(`Config by name ${name} not found`);
    }

    const dbConfig = this.parseDBconfig(config.db_section);

    return { bot_section: config.bot_section, db_section: dbConfig };
  }
}
