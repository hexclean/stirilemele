const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const Article = require("../../models/Article");
const ArticleAction = require("../../models/ArticleAction");

exports.postPolitics = async (req, res, next) => {
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
        const checkDb = await Article.findAll({
          where: { title: result[i].title },
        });
        if (checkDb.length == 0 && result[i].url !== undefined) {
          await Article.create({
            imageUrl: result[i].imageUrl.trim(),
            link: result[i].url.trim(),
            title: result[i].title.trim(),
            time: "2021-04-27 16:46:03",
            categoryId: 2,
            sourceId: 1,
          });
        }
      }
      return res.json({
        status: 200,
        msg: "Success",
        result: [],
      });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 500,
        msg: "Server error",
        result: [],
      });
    }
  }

  async function main() {
    const result = await scrapeListing();
    await saveData(result);
  }
  await main();
};

exports.postSport = async (req, res, next) => {
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
        const checkDb = await Article.findAll({
          where: { title: result[i].title },
        });
        if (checkDb.length == 0 && result[i].url !== undefined) {
          const articleId = await Article.create({
            imageUrl: result[i].imageUrl.trim(),
            link: result[i].url.trim(),
            title: result[i].title.trim(),
            seoUrl: result[i].title.trim().replace(/ /g, "-"),
            time: "2021-04-27 16:46:03",
            categoryId: 2,
            sourceId: 8,
          });
          // await ArticleAction.create({
          //   articleId: articleId[i].id,
          //   love: 0,
          //   like: 0,
          //   dislike: 0,
          // });
        }
      }
      return res.json({
        status: 200,
        msg: "Success",
        result: [],
      });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 500,
        msg: "Server error",
        result: [],
      });
    }
  }

  async function main() {
    const result = await scrapeListing();
    await saveData(result);
  }
  await main();
};

exports.postEconomic = async (req, res, next) => {
  async function scrapeListing() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://www.b1.ro/stiri/economic/");
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
        const checkDb = await Article.findAll({
          where: { title: result[i].title },
        });
        if (checkDb.length == 0 && result[i].url !== undefined) {
          await Article.create({
            imageUrl: result[i].imageUrl.trim(),
            link: result[i].url.trim(),
            title: result[i].title.trim(),
            time: "2021-04-27 16:46:03",
            categoryId: 3,
            sourceId: 1,
          });
        }
      }
      return res.json({
        status: 200,
        msg: "Success",
        result: [],
      });
    } catch (error) {
      console.log(error);
      return res.json({
        status: 500,
        msg: "Server error",
        result: [],
      });
    }
  }

  async function sleep(miliseconds) {
    return new Promise((resolve) => setTimeout(resolve, miliseconds));
    // await sleep(1000);
  }

  async function main() {
    const result = await scrapeListing();
    await saveData(result);
  }
  await main();
};
