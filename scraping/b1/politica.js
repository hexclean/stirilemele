const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const News = require("../../models/News");

exports.postBelfold = async (req, res, next) => {
  async function scrapeListing() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.b1.ro/stiri/politica/");
    const html = await page.content();
    const $ = cheerio.load(html);

    result = $("article")
      .map((index, element) => {
        const titleElement = $(element).find("h2");
        const urlElement = $(element).find("a");
        const imageUrlElement = $(element).find("img");
        const title = $(titleElement).text();
        const url = $(urlElement).attr("href");
        const imageUrl = "https://www.b1.ro" + $(imageUrlElement).attr("src");
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
        if (checkDb.length == 0 && result[i].url !== undefined) {
          await News.create({
            imageUrl: result[i].imageUrl.trim(),
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
