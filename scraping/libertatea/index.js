const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const News = require("../../models/Article");

exports.postBelfold = async (req, res, next) => {
  async function scrapeListing() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.libertatea.ro/sport");
    const html = await page.content();
    const $ = cheerio.load(html);

    result = $(".news-item")
      .map((index, element) => {
        const titleElement = $(element)
          .find(".news-item > .news-item-info > h2")
          .text();
        const urlElement = $(element).find("a");
        const imageUrlElement = $(element).find("a > picture > img");
        const title = titleElement;
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
