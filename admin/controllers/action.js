const Article = require("../../models/Article");
const Articles = require("../../models/Article");
const Source = require("../../models/Source");
const ArticleViewed = require("../../models/ArticleViewed");
const UserInterestedSources = require("../../models/UserInterestedSources");
const UserInterestedCategories = require("../../models/UserInterestedCategories");
const ArticleComment = require("../../models/ArticleComment");
const SendEmailSource = require("../../models/SendEmailSource");
const SendEmailCategory = require("../../models/SendEmailCategory");
const Category = require("../../models/Category");
const CategoryTranslation = require("../../models/CategoryTranslation");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
exports.postAddComment = async (req, res, next) => {
  const articleId = req.body.articleId;
  const comment = req.body.comment;
  let logged = 0;

  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }

  try {
    if (logged == 1) {
      await ArticleComment.create({
        articleId: articleId,
        userId: req.user.id,
        comment: comment,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.postEditChannels = async (req, res, next) => {
  const filteredChannel = req.body.statusChannel.filter(Boolean);
  let channelId = req.body.channelId;
  try {
    for (let i = 0; i < filteredChannel.length; i++) {
      await UserInterestedSources.update(
        {
          active: filteredChannel[i] == "on" ? 1 : 0,
          userId: req.user.id,
        },
        {
          where: {
            userId: req.user.id,
            sourceId: channelId[i],
          },
        }
      );
    }
    return res.redirect("/stiri");
  } catch (error) {
    console.log(error);
  }
};

exports.postEditCategory = async (req, res, next) => {
  const filteredCategory = req.body.statusCategory.filter(Boolean);
  let categoryId = req.body.categoryId;
  try {
    for (let i = 0; i < filteredCategory.length; i++) {
      await UserInterestedCategories.update(
        {
          active: filteredCategory[i] == "on" ? 1 : 0,
          userId: req.user.id,
        },
        {
          where: {
            userId: req.user.id,
            categoryId: categoryId[i],
          },
        }
      );
    }
    return res.redirect("/stiri");
  } catch (error) {
    console.log(error);
  }
};

exports.postSendpostSaveToHistory = async (req, res, next) => {
  const articleId = req.body.articleId;
  let clicked = 0;
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  const article = await Article.findOne({
    where: { id: articleId },
  });
  clicked = article.clicked;
  ++clicked;

  try {
    if (logged == 1) {
      await ArticleViewed.create({
        userId: req.user.id,
        articleId: articleId,
      });
    }
    await Article.update(
      {
        clicked: clicked,
      },
      { where: { id: articleId } }
    );
    res.redirect(article.link);
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

exports.postSendEmailDay = async (req, res, next) => {
  const filteredCategory = req.body.statusCategory.filter(Boolean);
  let categoryId = req.body.categoryId;
  const filteredChannel = req.body.statusChannel.filter(Boolean);
  let channelId = req.body.channelId;
  try {
    for (let i = 0; i < filteredCategory.length; i++) {
      await SendEmailCategory.update(
        {
          active: filteredCategory[i] == "on" ? 1 : 0,
          userId: req.user.id,
          categoryId: categoryId[i],
        },
        {
          where: {
            userId: req.user.id,
            categoryId: categoryId[i],
          },
        }
      );
    }
    for (let i = 0; i < filteredChannel.length; i++) {
      await SendEmailSource.update(
        {
          active: filteredChannel[i] == "on" ? 1 : 0,
          userId: req.user.id,
          sourceId: channelId[i],
        },
        {
          where: {
            userId: req.user.id,
            sourceId: channelId[i],
          },
        }
      );
    }
    return res.redirect("/stiri");
  } catch (error) {
    console.log(error);
  }
};
