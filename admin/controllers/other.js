const Articles = require("../../models/Article");
const Source = require("../../models/Source");
const Category = require("../../models/Category");
const CategoryTranslation = require("../../models/CategoryTranslation");
const UserInterestedCategories = require("../../models/UserInterestedCategories");
const UserInterestedSources = require("../../models/UserInterestedSources");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const ITEMS_PER_PAGE = 28;
const TODAY_START = new Date().setHours(0, 0, 0, 0);
const NOW = new Date();
const { getLanguageCode } = require("../../shared/language");

exports.getConfiguredHome = async (req, res, next) => {
  const languageCode = getLanguageCode(req.cookies.language);
  let interestedCategoryId = [];
  let interestedSourceId = [];
  const page = +req.query.page || 1;
  let totalItems;
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
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
      { model: Category, include: [{ model: CategoryTranslation }] },
    ],
  });
  try {
    const selectedCategories = await UserInterestedCategories.findAll({
      where: { userId: req.user.id, active: 1 },
    });
    for (let i = 0; i < selectedCategories.length; i++) {
      interestedCategoryId.push(selectedCategories[i].categoryId);
    }

    const selectedSources = await UserInterestedSources.findAll({
      where: { userId: req.user.id, active: 1 },
    });
    for (let i = 0; i < selectedSources.length; i++) {
      interestedSourceId.push(selectedSources[i].sourceId);
    }

    await Articles.findAll({
      where: {
        sourceId: {
          [Op.in]: interestedSourceId,
        },
        categoryId: {
          [Op.in]: interestedCategoryId,
        },
      },
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
          where: {
            sourceId: {
              [Op.in]: interestedSourceId,
            },
            categoryId: {
              [Op.in]: interestedCategoryId,
            },
          },
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
        res.render("home/configuredHome", {
          path: "/stiri-configurate",
          pageTitle: "Știrilemele - ultimele știri",
          articles: articles.reverse(),
          logged: logged,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems.length,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems.length / ITEMS_PER_PAGE),
          currentPage: page,
          sources: sources,
          bestArticles: bestArticles,
        });
      });
  } catch (error) {
    console.log(error);
  }
};

exports.getCategoryScreen = async (req, res, next) => {
  const languageCode = getLanguageCode(req.cookies.language);
  let categories = [];
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }

  try {
    const allCategories = await Category.findAll({
      include: [
        { model: CategoryTranslation, where: { languageId: languageCode } },
      ],
    });

    res.render("categories/index", {
      path: "/categorii",
      pageTitle: "Categorii",
      categories: categories,
      logged: logged,
      allCategories: allCategories,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getFontos = (req, res, next) => {
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  res.render("source/fontos", {
    path: "/important",
    pageTitle: "Signup",
    isAuthenticated: false,
    logged: logged,
  });
};

exports.getBetekintes = (req, res, next) => {
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  res.render("source/betekintes", {
    path: "/help",
    pageTitle: "Signup",
    isAuthenticated: false,
    logged: logged,
  });
};
