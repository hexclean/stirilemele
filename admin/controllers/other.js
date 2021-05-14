const Articles = require("../../models/Article");
const Source = require("../../models/Source");
const Category = require("../../models/Category");
const CategoryTranslation = require("../../models/CategoryTranslation");
const UserInterestedCategories = require("../../models/UserInterestedCategories");
const UserInterestedSources = require("../../models/UserInterestedSources");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getTopArticles = async (req, res, next) => {
  try {
    const articles = await Articles.findAll({
      order: [["clicked", "DESC"]],
      include: [
        {
          model: Source,
        },
        { model: Category },
      ],
    });
    console.log(articles);
    res.render("categories/top", {
      path: "/login",
      pageTitle: "Login",
      articles: articles,
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
        // where: { secondary: 1 },
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
    console.log(allCategories);
    res.render("categories/index", {
      path: "/login",
      pageTitle: "Login",
      articles: articles,
      categories: categories,
      logged: logged,
      allCategories: allCategories,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getChannels = async (req, res, next) => {
  if (req.admin != undefined) {
    res.redirect("/admin/orders");
  }
  const channels = await Articles.findAll();
  res.render("categories/channels", {
    path: "/signup",
    pageTitle: "Signup",
    channels: channels,
  });
};
