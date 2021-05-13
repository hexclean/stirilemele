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
  console.log(req.body);
  try {
    await ArticleComment.create({
      articleId: articleId,
      userId: req.user.id,
      comment: comment,
    });
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
  const article = await Article.findOne({
    where: { id: articleId },
  });
  clicked = article.clicked;
  ++clicked;

  try {
    await ArticleViewed.create({
      userId: req.user.id,
      articleId: articleId,
    });
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

exports.getEmailSender = async (req, res, next) => {
  let categories = [];
  console.log(req.user.id);
  let articles = [];
  let interestedCategoryId = [];
  try {
    categories = await SendEmailCategory.findAll({
      where: { userId: req.user.id, active: 1 },
    });
    for (let i = 0; i < categories.length; i++) {
      interestedCategoryId.push(categories[i].categoryId);
    }
    articles = await SendEmailSource.findAll({
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

    for (let i = 0; i < articles.length; i++) {
      if (articles[i].Source !== null) {
        for (let j = 0; j < articles[i].Source.Articles.length; j++) {
          console.log(1, articles[i].Source.Articles[j].title);
        }
      }
    }

    res.render("home/test", {
      path: "/login",
      pageTitle: "Login",
      // source: source,
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
