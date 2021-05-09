const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const News = require("../../models/Article");

exports.postSport = async (req, res, next) => {
  async function scrapeListing() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.cancan.ro/sport");
    const html = await page.content();
    const $ = cheerio.load(html);

    result = $(".article")
      .map((index, element) => {
        const titleElement = $(element).find("h2");
        const urlElement = $(element).find("a");
        const imageUrlElement = $(element).find("img");
        const title = $(titleElement).text();
        const url = $(urlElement).attr("href");
        const imageUrl = $(imageUrlElement).attr("src");
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
        if (checkDb.length == 0) {
          await News.create({
            imageUrl: result[i].imageUrl.trim(),
            link: result[i].url.trim(),
            title: result[i].title.trim(),
            time: "2021-04-27 16:46:03",
            categoryId: 1,
            sourceId: 2,
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
