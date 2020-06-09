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
        await ctx.replyWithMarkdown(`
*${dbUser.first_name}*, _let me show the magic_!
`);
        //@ts-ignore
        return ctx.scene.enter("country");
      }
      const createdDBUser = await ctx.db.users.add({
        id: idStr,
        status: UserStatsEnum.registered,
        first_name,
        username,
      });
      await ctx.replyWithMarkdown(
        `Hello,  *${createdDBUser.first_name}*! 

Thank you for registration!

_Let's go start show data!_`
      );
      //@ts-ignore
      ctx.scene.enter("country");
    }
  }
  async helpHandler(ctx: TlgfCtxT) {
    const { from, chat } = ctx;
    if (from && chat) {
      ctx.replyWithMarkdown(`
*${super.getCmdStr(
        BotCommandEnum.start
      )} *- _start menu_ (\`must for new users\`)\n
*${super.getCmdStr(BotCommandEnum.help)} *- _all comands_\n
*${super.getCmdStr(BotCommandEnum.settings)}* - _chat info_\n
*${super.getCmdStr(BotCommandEnum.country)} *- _get stat's about country_\n

`);
    }
  }
  async settingsHandler(ctx: TlgfCtxT) {
    const { from, chat } = ctx;
    console.log(ctx.update.message);
    if (from && chat) {
      ctx.replyWithMarkdown(`
*user id : ${from.id}*
  `);
    }
  }
}
