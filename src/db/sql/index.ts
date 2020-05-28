import { sql } from "./sql";

export const users = {
  userCreate: sql("users/userCreate.pgsql"),
  userAdd: sql("users/userAdd.pgsql"),
  userFindById: sql("users/userFindById.pgsql"),
};
