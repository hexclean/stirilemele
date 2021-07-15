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
const ITEMS_PER_PAGE = 28;
const { getLanguageCode } = require("../../shared/language");

exports.getAllChannel = async (req, res, next) => {
  let cookie = req.cookies.cookie;
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  try {
    const channels = await Source.findAll();
    res.render("source/AllChannels", {
      path: "/channels",
      pageTitle: "Portal de știri",
      logged: logged,
      channels: channels,
      channelsLength: channels.length,
      cookie: cookie,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getChannelCategories = async (req, res, next) => {
  const languageCode = getLanguageCode(req.cookies.language);
  let cookie = req.cookies.cookie;
  const page = +req.query.page || 1;
  let totalItems;
  let channelName = req.params.channelName;
  const source = await Source.findOne({ where: { seoUrl: channelName } });
  let followedSource;
  let sourceId = source.id;
  let sourceName = source.name;
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
    followedSource = await UserInterestedSources.findOne({
      where: { sourceId: source.id, userId: req.user.id },
    });
  } else {
    logged = 0;
  }
  try {
    const primaryCategories = await SourceCategories.findAll({
      where: {
        sourceId: sourceId,
        prim: 1,
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
    });
    const secondaryategories = await SourceCategories.findAll({
      where: {
        sourceId: sourceId,
        prim: 0,
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
          include: [
            { model: CategoryTranslation, where: { languageId: languageCode } },
          ],
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
                {
                  model: CategoryTranslation,
                  where: { languageId: languageCode },
                },
              ],
            },
          ],
        });
      })
      .then((articles) => {
        res.render("categories/channel-name", {
          path: "/login",
          pageTitle: "Portal de știri",
          articles: articles.reverse(),
          primaryCategories: primaryCategories,
          sourceName: sourceName,
          logged: logged,
          source: source,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems.length,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems.length / ITEMS_PER_PAGE),
          currentPage: page,
          channelName: channelName,
          followedSource: followedSource,
          secondaryategories: secondaryategories,
          cookie: cookie,
        });
      });
  } catch (error) {
    console.log(error);
  }
};

exports.getChannelCategory = async (req, res, next) => {
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
    const categoryName = await Category.findOne({
      where: { seoUrl: req.params.categoryName },
      include: [
        { model: CategoryTranslation, where: { languageId: languageCode } },
      ],
    });
    const sourceName = await Source.findOne({
      where: { seoUrl: req.params.channelName },
    });
    let categoryId = categoryName.id;
    let sourceId = sourceName.id;

    const primaryCategories = await SourceCategories.findAll({
      where: {
        sourceId: sourceId,
        prim: 1,
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
    });
    const secondaryategories = await SourceCategories.findAll({
      where: {
        sourceId: sourceId,
        prim: 0,
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
          include: [
            { model: Category, include: [{ model: CategoryTranslation }] },
            { model: Source },
          ],
        });
      })
      .then((selectedArticles) => {
        res.render("categories/selectedCatSor", {
          path: "/login",
          pageTitle: "Login",
          logged: logged,
          source: sourceName,
          selectedArticles: selectedArticles.reverse(),
          secondaryategories: secondaryategories,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems.length,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems.length / ITEMS_PER_PAGE),
          currentPage: page,
          categoryName: categoryName,
          primaryCategories: primaryCategories,
          cookie: cookie,
        });
      });
  } catch (error) {
    console.log(error);
  }
};

exports.postFollowSource = async (req, res, next) => {
  const sourceId = req.body.sourceId;
  const source = await Source.findByPk(sourceId);
  const currentSourceId = source.id;
  let sourceName = req.body.channelName;

  try {
    await UserInterestedSources.update(
      { active: 1 },
      { where: { sourceId: currentSourceId } }
    );
    res.redirect(`/channels/${sourceName}`);
  } catch (error) {
    console.log(error);
  }
};

exports.postUnFollowSource = async (req, res, next) => {
  const sourceId = req.body.sourceId;
  const source = await Source.findByPk(sourceId);
  const currentSourceId = source.id;
  let sourceName = req.body.channelName;

  try {
    await UserInterestedSources.update(
      { active: 0 },
      { where: { sourceId: currentSourceId } }
    );
    res.redirect(`/channels/${sourceName}`);
  } catch (error) {
    console.log(error);
  }
};
