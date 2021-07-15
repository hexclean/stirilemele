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

exports.getHome = async (req, res, next) => {
  const languageCode = getLanguageCode(req.cookies.language);
  let cookie = req.cookies.cookie;
  const page = +req.query.page || 1;
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
        res.render("home/index", {
          path: "/",
          pageTitle: "Știrilemele - ultimele știri",
          articles: articles,
          logged: logged,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems.length,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems.length / ITEMS_PER_PAGE),
          currentPage: page,
          sources: sources,
          bestArticles: bestArticles,
          cookie: cookie,
        });
      });
  } catch (error) {
    console.log(error);
  }
};
