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
  let cookie = req.cookies.cookie;
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
          cookie: cookie,
        });
      });
  } catch (error) {
    console.log(error);
  }
};

exports.getCategoryScreen = async (req, res, next) => {
  const languageCode = getLanguageCode(req.cookies.language);
  let cookie = req.cookies.cookie;
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
      cookie: cookie,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getFontos = (req, res, next) => {
  let cookie = req.cookies.cookie;
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
    cookie: cookie,
  });
};

exports.getContact = (req, res, next) => {
  let cookie = req.cookies.cookie;
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  res.render("source/contact", {
    path: "/contact",
    pageTitle: "Signup",
    isAuthenticated: false,
    logged: logged,
    cookie: cookie,
  });
};

exports.getCookie = (req, res, next) => {
  let cookie = req.cookies.cookie;
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  res.render("source/cookie", {
    path: "/contact",
    pageTitle: "Signup",
    isAuthenticated: false,
    logged: logged,
    cookie: cookie,
  });
};

exports.getCookieTable = (req, res, next) => {
  let cookie = req.cookies.cookie;
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  res.render("source/cookie-table", {
    path: "/contact",
    pageTitle: "Signup",
    isAuthenticated: false,
    logged: logged,
    cookie: cookie,
  });
};
