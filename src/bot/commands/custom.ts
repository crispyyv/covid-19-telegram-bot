import { TlgfCtxT } from "..";
import { BotCommandEnum, Commands } from "./commands";
import { Markup, Extra } from "telegraf";
import fetch from "node-fetch";

export interface IcountryData {
  Country: String;
  CountryCode: String;
  Slug: String;
  NewConfirmed: Number;
  TotalConfirmed: Number;
  NewDeaths: Number;
  TotalDeaths: Number;
  NewRecovered: Number;
  TotalRecovered: Number;
  Date: String;
}

const kyboard = Markup.inlineKeyboard([
  Markup.callbackButton("ukraine", "ukraine"),
]);
export class CustomCommands extends Commands {
  constructor() {
    super();
  }

  countries(ctx: TlgfCtxT) {
    let msg = ctx;
    console.log(msg);
    ctx.reply("Please select country", Extra.markup(kyboard));
  }

  async useCountry(ctx: TlgfCtxT, country: string) {
    let info = await this.fetchData(country);
    console.log(info);
    ctx.reply(`Info for you'r country: ${JSON.parse(info)}`);
  }

  private async fetchData(countryName: string) {
    const data = await fetch(`https://api.covid19api.com/summary`);
    const json = await data.json();
    let currentCountryInfo = json["Countries"].filter(
      (countryInfo: IcountryData) => countryInfo.Slug === countryName
    );

    return currentCountryInfo[0];
  }
}
