const Article = require("../../models/Article");
const Source = require("../../models/Source");
const ArticleViewed = require("../../models/ArticleViewed");
const UserInterestedSources = require("../../models/UserInterestedSources");
const UserInterestedCategories = require("../../models/UserInterestedCategories");
const ArticleComment = require("../../models/ArticleComment");
const SendEmailSource = require("../../models/SendEmailSource");
const SendEmailCategory = require("../../models/SendEmailCategory");

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
  //   res.render("source/source-detail", {
  //     path: "/login",
  //     pageTitle: "Login",
  //     source: source,
  //   });
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
