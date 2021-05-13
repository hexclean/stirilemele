const bcrypt = require("bcryptjs");
const User = require("../../models/Users");
const Articles = require("../../models/Article");
const Source = require("../../models/Source");
const Category = require("../../models/Category");
const CategoryTranslation = require("../../models/CategoryTranslation");
const UserInterestedCategories = require("../../models/UserInterestedCategories");
const UserInterestedSources = require("../../models/UserInterestedSources");
const ArticleAction = require("../../models/ArticleAction");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { validationResult } = require("express-validator/check");
const Article = require("../../models/Article");
const ArticleViewed = require("../../models/ArticleViewed");
const ArticleComment = require("../../models/ArticleComment");

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
    nothing = 1;
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
        // where: { secondary: 1 },
        include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
      });
      // console.log(interestedCategoryId);
      articles = await UserInterestedSources.findAll({
        where: {
          userId: req.user.id,
          active: 1,
        },
        include: [
          {
            model: Source,
            include: [
              {
                model: Articles,
                where: {
                  categoryId: {
                    [Op.in]: interestedCategoryId,
                  },
                },
                include: [{ model: Category }],
              },
            ],
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
        order: [["createdAt", "ASC"]],
        include: [
          {
            model: Source,
          },
          { model: Category },
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
      nothing: nothing,
      allCategories: allCategories,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.getHistoryArticles = async (req, res, next) => {
  try {
    const articles = await ArticleViewed.findAll({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: Articles,
          include: [
            {
              model: Source,
            },
            {
              model: Category,
            },
          ],
        },
      ],
    });
    for (let i = 0; i < articles.length; i++) {
      console.log(articles[i].Article);
      // for (let j = 0; j < articles[i].Article.length; j++) {
      //   console.log(articles[i].Article[j]);
      // }
    }

    res.render("categories/history", {
      path: "/login",
      pageTitle: "Login",
      articles: articles,
    });
  } catch (error) {
    console.log(error);
  }
};
