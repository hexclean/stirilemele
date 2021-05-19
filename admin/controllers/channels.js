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
      ],
    });

    const articles = await Articles.findAll({
      order: [["clicked", "DESC"]],
      where: { sourceId: sourceId },
      limit: 10,
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
    console.log(articles);
    res.render("categories/channel-name", {
      path: "/login",
      pageTitle: "Login",
      articles: articles,
      allCategories: allCategories,
      sourceName: sourceName,
      logged: logged,
    });
  } catch (error) {
    console.log(error);
  }
};
