import { UserStatsEnum } from "../../db/models";
import { TlgfCtxT } from "..";
import { BotCommandEnum, Commands } from "./commands";

export class StandartCommands extends Commands {
  constructor() {
    super();
  }
  async startHandler(ctx: TlgfCtxT) {
    if (ctx.from) {
      const { id, first_name, username } = ctx.from;

      const idStr = String(id);

      const dbUser = await ctx.db.users.findById(idStr);
      if (dbUser) {
        return ctx.reply(`You'r already registred! ${dbUser.first_name}`);
      }
      const createdDBUser = await ctx.db.users.add({
        id: idStr,
        status: UserStatsEnum.registered,
        first_name,
        username,
      });
      ctx.reply(
        `Hello,  ${createdDBUser.first_name}! Thank you for registration!`
      );
    }
  }
  async helpHandler(ctx: TlgfCtxT) {
    const { from, chat } = ctx;
    if (from && chat) {
      ctx.reply(`
${super.getCmdStr(BotCommandEnum.help)}
${super.getCmdStr(BotCommandEnum.settings)}
${super.getCmdStr(BotCommandEnum.start)}
`);
    }
  }
  async settingsHandler(ctx: TlgfCtxT) {
    const { from, chat } = ctx;
    if (from && chat) {
      ctx.reply(`
chat id : ${chat.id}
user id : ${from.id}
  `);
    }
  }
}
