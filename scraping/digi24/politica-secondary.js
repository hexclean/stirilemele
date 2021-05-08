const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const News = require("../../models/Article");

exports.postPoliticaSecondary = async (req, res, next) => {
  async function scrapeListing() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.digi24.ro/stiri/actualitate/politica");
    const html = await page.content();
    const $ = cheerio.load(html);

    result = $(".article-alt ")
      .map((index, element) => {
        const titleElement = $(element).find("h4");
        const urlElement = $(element).find("a");
        const imageUrlElement = $(element).find("img");
        const title = $(titleElement).text();
        const url = "https://www.digi24.ro" + $(urlElement).attr("href");
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
            href: "result[i].url",
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

exports.postPoliticaPrimary = async (req, res, next) => {
  async function scrapeListing() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.digi24.ro/stiri/actualitate/politica");
    const html = await page.content();
    const $ = cheerio.load(html);

    result = $(".article-alt ")
      .map((index, element) => {
        const titleElement = $(element).find("h4");
        const urlElement = $(element).find("a");
        const imageUrlElement = $(element).find("img");
        const title = $(titleElement).text();
        const url = "https://www.digi24.ro" + $(urlElement).attr("href");
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
            imageUrl: result[i].imageUrl,
            href: "result[i].url",
            title: result[i].title,
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
