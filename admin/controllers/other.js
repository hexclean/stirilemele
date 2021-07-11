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

exports.getConfiguredHome = async (req, res, next) => {
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
          include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
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
                { model: CategoryTranslation, where: { languageId: 2 } },
              ],
            },
            { model: Source },
          ],
        });
      })

      .then((articles) => {
        res.render("home/configuredHome", {
          path: "/login",
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
        });
      });
  } catch (error) {
    console.log(error);
  }
};

exports.getSignup = (req, res, next) => {
  if (req.admin != undefined) {
    res.redirect("/admin/orders");
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};
exports.getTopArticles = async (req, res, next) => {
  let logged = 0;
  try {
    if (req.user != undefined) {
      logged = 1;
    } else {
      top = 0;
    }
    const articles = await Articles.findAll({
      order: [["clicked", "DESC"]],
      limit: 15,
      include: [
        {
          model: Source,
        },
        { model: Category },
      ],
    });

    res.render("categories/top", {
      path: "/login",
      pageTitle: "Login",
      articles: articles,
      logged: logged,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getCategoryScreen = async (req, res, next) => {
  let logged = 0;
  let categories = [];
  let allCategories = [];
  let articles = [];
  let interestedCategoryId = [];
  const page = +req.query.page || 1;
  let totalItems;
  const bestArticles = await Articles.findAll({
    createdAt: {
      [Op.gt]: TODAY_START,
      [Op.lt]: NOW,
    },
    order: [["clicked", "DESC"]],
    limit: 4,
    include: [{ model: Source }, { model: Category }],
  });
  try {
    if (req.user != undefined) {
      logged = 1;
      categories = await UserInterestedCategories.findAll({
        where: { userId: req.user.id, active: 1 },
        include: [
          {
            model: Category,
            include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
          },
        ],
      });
      for (let i = 0; i < categories.length; i++) {
        interestedCategoryId.push(categories[i].categoryId);
      }
      allCategories = await Category.findAll({
        include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
      });

      articles = await Articles.findAll({
        order: [["clicked", "DESC"]],
        limit: 20,
        include: [
          {
            model: Source,
          },
          {
            model: Category,
            include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
          },
        ],
      });
    } else {
      logged = 0;
      allCategories = await Category.findAll({
        include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
      });
      articles = await Articles.findAll({
        order: [["clicked", "DESC"]],
        limit: 20,
        include: [
          {
            model: Source,
          },
          {
            model: Category,
            include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
          },
        ],
      });
    }
    const sources = await Source.findAll();
    res.render("categories/index", {
      path: "/login",
      pageTitle: "Login",
      articles: articles,
      categories: categories,
      logged: logged,
      allCategories: allCategories,
      bestArticles: bestArticles,
      sources: sources,
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
    path: "/signup",
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
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    logged: logged,
  });
};
