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
const SourceCategories = require("../../models/SourceCategories");
const ITEMS_PER_PAGE = 40;
exports.getAllChannel = async (req, res, next) => {
  let logged = 0;
  let channels = [];
  try {
    if (req.user != undefined) {
      logged = 1;
      channels = await UserInterestedSources.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: Source,
          },
        ],
      });
      for (let i = 0; i < channels.length; i++) {
        console.log(channels[i].Source.name);
      }
    } else {
      logged = 0;
      channels = await Source.findAll();
    }

    res.render("source/AllChannels", {
      path: "/login",
      pageTitle: "Login",
      logged: logged,
      channels: channels,
      channelsLength: channels.length,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getChannelCategories = async (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  let channelName = req.params.channelName;
  const source = await Source.findOne({ where: { seoUrl: channelName } });
  let sourceId = source.id;
  let sourceName = source.name;
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  try {
    const allCategories = await SourceCategories.findAll({
      where: {
        sourceId: sourceId,
      },

      include: [
        {
          model: Category,
          include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
        },
        { model: Source },
      ],
    });

    await Articles.findAll({
      order: [["clicked", "DESC"]],
      where: { sourceId: sourceId },
      include: [
        {
          model: Source,
        },
        {
          model: Category,
          include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
        },
      ],
    })
      .then(async (numArticles) => {
        totalItems = numArticles;
        return await Articles.findAll({
          order: [["clicked", "DESC"]],
          where: { sourceId: sourceId },
          offset: (page - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
          include: [
            {
              model: Source,
            },
            {
              model: Category,
              include: [
                { model: CategoryTranslation, where: { languageId: 2 } },
              ],
            },
          ],
        });
      })
      .then((articles) => {
        res.render("categories/channel-name", {
          path: "/login",
          pageTitle: "Login",
          articles: articles,
          allCategories: allCategories,
          sourceName: sourceName,
          logged: logged,
          source: source,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems.length,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems.length / ITEMS_PER_PAGE),
          currentPage: page,
        });
      });
  } catch (error) {
    console.log(error);
  }
};

exports.getChannelCategory = async (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  try {
    const categoryName = await Category.findOne({
      where: { seoUrl: req.params.categoryName },
    });
    const sourceName = await Source.findOne({
      where: { seoUrl: req.params.channelName },
    });
    let categoryId = categoryName.id;
    let sourceId = sourceName.id;

    const allCategories = await SourceCategories.findAll({
      where: {
        sourceId: sourceId,
      },

      include: [
        {
          model: Category,
          include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
        },
        { model: Source },
      ],
    });
    await Articles.findAll({
      where: { sourceId: sourceId, categoryId: categoryId },
    })
      .then(async (numArticles) => {
        totalItems = numArticles;
        return await Articles.findAll({
          where: { sourceId: sourceId, categoryId: categoryId },
          offset: (page - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
        });
      })
      .then((selectedArticles) => {
        res.render("categories/selectedCatSor", {
          path: "/login",
          pageTitle: "Login",
          logged: logged,
          source: sourceName.name,
          selectedArticles: selectedArticles,
          allCategories: allCategories,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems.length,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems.length / ITEMS_PER_PAGE),
          currentPage: page,
        });
      });
  } catch (error) {
    console.log(error);
  }
};
