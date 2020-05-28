import { IDatabase, IMain } from "pg-promise";
import { IResult } from "pg-promise/typescript/pg-subset";
import { users as sql } from "../sql";
import { UserModel, UserDBModel } from "../models";

export class UsersRepository {
  constructor(private db: IDatabase<any>, private pgp: IMain) {}

  // Creates the table;
  async create(): Promise<null> {
    return this.db.none(sql.userCreate);
  }

  // Adds a new user, and returns the new object;
  async add({
    id,
    status,
    first_name,
    username,
  }: UserModel): Promise<UserDBModel> {
    return this.db.one(sql.userAdd, [id, status, first_name, username]);
  }

  async findById(id: string): Promise<UserDBModel | null> {
    return this.db.oneOrNone(sql.userFindById, [id]);
  }
}
