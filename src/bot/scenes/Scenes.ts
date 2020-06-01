import { TelegrafContext } from "telegraf/typings/context";
import countries from "i18n-iso-countries";
import { BaseScene } from "telegraf";
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

export class Scenes {
  async fetchData(countryName: string) {
    const covidData = await fetch(`https://api.covid19api.com/summary`);
    const countryObj = await covidData.json();
    console.log(countryObj);
    let currentCountryInfo = countryObj["Countries"].filter(
      (countryInfo: IcountryData) => countryInfo.Country === countryName
    );
    return currentCountryInfo[0];
  }
  countryScene() {
    const country = new BaseScene("country");
    country.enter((ctx: TelegrafContext) =>
      ctx.reply("Hello, send me country cod (eg. USA)")
    );
    country.on("text", async (ctx: TelegrafContext) => {
      let countryCode = await ctx.message?.text;
      console.log(countryCode);
      let countryName = countries.getName(countryCode || "", "en");
      console.log(countryName);
      if (!country || countryCode!.length < 2) {
        ctx.reply(
          "It looks like a country with such a code does not exist. Try again!"
        );
      } else {
        const info = await this.fetchData(countryName);
        console.log(info);
        const { NewConfirmed, TotalConfirmed, NewDeaths, TotalDeaths } = info;
        ctx.reply(`${countryName} stats\n
New confirmed: ${NewConfirmed}
Total confirmed: ${TotalConfirmed}
New death: ${NewDeaths}
Total death: ${TotalDeaths}
             `);
      }
    });
    country.on("message", (ctx: TelegrafContext) => {
      ctx.reply("It's dont look like as text");
    });

    return country;
  }
}
