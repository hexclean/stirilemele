const Article = require("../../models/Article");
const Source = require("../../models/Source");
const ArticleViewed = require("../../models/ArticleViewed");
const ArticleAction = require("../../models/ArticleAction");
const ArticleComment = require("../../models/ArticleComment");

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
