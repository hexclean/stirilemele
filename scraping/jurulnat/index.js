const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const News = require("../../models/Article");

exports.postBelfold = async (req, res, next) => {
  async function scrapeListing() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://jurnalulnational.ro/stiri/politica/");
    const html = await page.content();
    const $ = cheerio.load(html);

    result = $("article")
      .map((index, element) => {
        const titleElement = $(element).find(
          ".item-content > .content-container > h2"
        );
        const urlElement = $(element).find("div > a");
        const imageUrlElement = $(element).find("div > a");
        const title = $(titleElement).text();
        const url = $(urlElement).attr("href");
        const imageUrl = $(imageUrlElement).attr("style");
        return { title, url, imageUrl };
      })
      .get();
    console.log(result);
    return result;
  }

  async function saveData(result) {
    try {
      for (let i = 0; i < result.length; i++) {
        const checkDb = await News.findAll({
          where: { title: result[i].title },
        });
        if (checkDb.length == 0 && result[i].title.length > 2) {
          await News.create({
            imageUrl: result[i].imageUrl,
            href: result[i].url.trim(),
            title: result[i].title.trim(),
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function main() {
    const result = await scrapeListing();
    await saveData(result);
  }
  await main();
};
