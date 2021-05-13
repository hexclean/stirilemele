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
