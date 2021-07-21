const Articles = require("../../models/Article");
const Source = require("../../models/Source");
const Category = require("../../models/Category");
const CategoryTranslation = require("../../models/CategoryTranslation");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const TODAY_START = new Date().setHours(0, 0, 0, 0);
const NOW = new Date();
const ITEMS_PER_PAGE = 28;
const { getLanguageCode } = require("../../shared/language");
var moment = require("moment");

exports.getHome = async (req, res, next) => {
  const languageCode = getLanguageCode(req.cookies.language);
  let cookie = req.cookies.cookie;
  const page = +req.query.page || 1;
  // let articles = []
  let totalItems;
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  try {
    const sources = await Source.findAll();
    const bestArticles = await Articles.findAll({
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW,
      },
      order: [["clicked", "DESC"]],
      limit: 4,
      include: [
        { model: Source },
        {
          model: Category,
          include: [
            { model: CategoryTranslation, where: { languageId: languageCode } },
          ],
        },
      ],
    });
    await Articles.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Category,
          include: [
            { model: CategoryTranslation, where: { languageId: languageCode } },
          ],
        },
        { model: Source },
      ],
    })
      .then(async (numArticles) => {
        totalItems = numArticles;

        return await Articles.findAll({
          offset: (page - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: Category,
              include: [
                {
                  model: CategoryTranslation,
                  where: { languageId: languageCode },
                },
              ],
            },
            { model: Source },
          ],
        });
      })
      .then((articles) => {
        // let finalArticles = [];
        // for (let i = 0; i < articles.length; i++) {
        //   var today = articles[i].createdAt;
        //   var Christmas = new Date();
        //   var diffMs = Christmas - today; // milliseconds between now & Christmas
        //   var diffDays = Math.floor(diffMs / 86400000); // days
        //   var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        //   var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        //   articles.push({ time: diffMins, articles });
        // }
        // console.log(articles);
        res.render("home/index", {
          path: "/",
          pageTitle: "Știrilemele - ultimele știri",
          // finalArticles: finalArticles,
          logged: logged,
          articles: articles,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems.length,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems.length / ITEMS_PER_PAGE),
          currentPage: page,
          sources: sources,
          bestArticles: bestArticles,
          cookie: cookie,
          imageUrl: "",
          description: "Știrielmele",
          url: "",
        });
      });
  } catch (error) {
    console.log(error);
  }
};
