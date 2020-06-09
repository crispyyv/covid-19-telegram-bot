import { TelegrafContext } from "telegraf/typings/context";
import countries from "i18n-iso-countries";
import { BaseScene, Markup } from "telegraf";
import fetch from "node-fetch";
import AbortController from "abort-controller";

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
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 6000);
    return fetch(`https://api.covid19api.com/summary`, {
      signal: controller.signal,
    })
      .then((res) => {
        return res.json();
      })
      .then(
        (data) => {
          const currentCountryInfo = data["Countries"].filter(
            (countryInfo: IcountryData) => countryInfo.Country === countryName
          );
          console.log(data);
          return currentCountryInfo[0];
        },
        (err) => {
          if (err.name === "AbortError") {
            throw new Error("Response timed out");
          }
          throw new Error(err.message);
        }
      )
      .finally(() => {
        clearTimeout(timeout);
      });
    // const countryObj = await covidData.json();

    // const currentCountryInfo = countryObj["Countries"].filter(
    //   (countryInfo: IcountryData) => countryInfo.Country === countryName
    // );
    // console.log(countryObj[1]);
    // return currentCountryInfo[0];
  }

  countryScene() {
    const country = new BaseScene("country");
    country.enter((ctx: TelegrafContext) =>
      ctx.replyWithMarkdown("_Please send me country cod_ \n`(ex. US)`")
    );
    country.on("text", async (ctx: TelegrafContext) => {
      let countryCode = await ctx.message?.text;
      console.log(countryCode);
      let countryName = countries.getName(countryCode || "", "en");
      console.log(countryName);
      if (!countryName || countryCode!.length !== 2) {
        ctx.reply(
          "It looks like a country with such a code does not exist. Try again!"
        );
      } else {
        try {
          await ctx.replyWithMarkdown("_Wait please data is fetching..._");
          const info = await this.fetchData(countryName);
          // let data = await info.json()

          console.log(info);
          const { NewConfirmed, TotalConfirmed, NewDeaths, TotalDeaths } = info;
          ctx.replyWithMarkdown(
            `*${countryName} stats\n*
_New confirmed: ${NewConfirmed}_
_Total confirmed: ${TotalConfirmed}_
_New death: ${NewDeaths}_
_Total death: ${TotalDeaths}_

`,
            Markup.inlineKeyboard([
              Markup.callbackButton(
                "I wan't more statistics 😈😈😈",
                "country"
              ),
            ]).extra()
          );

          //@ts-ignore-start

          ctx.scene.leave();
        } catch (error) {
          await ctx.replyWithMarkdown(
            `_Sorry trouble with api😔_\n\n*Let's try again*`
          );
          //@ts-ignore-start
          ctx.scene.reenter();
        }
      }
    });
    country.on("message", (ctx: TelegrafContext) => {
      ctx.reply("It's dont look like as text");
    });

    return country;
  }
}
