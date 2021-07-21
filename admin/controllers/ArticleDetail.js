const Article = require("../../models/Article");
const Source = require("../../models/Source");
const ArticleViewed = require("../../models/ArticleViewed");
const ArticleComment = require("../../models/ArticleComment");
const ArticleAction = require("../../models/ArticleAction");

exports.getViewArticle = async (req, res, next) => {
  const editMode = req.query.edit;
  const articleName = req.params.articleName;
  const 
  try {
    const article = await Article.findOne({
                  where: {
                    seoUrl: articleName,
                  },
                  include: [
                    {
                      model: Source,
        },
      ],
    });
    const comments = await ArticleComment.findAll({         where:{articleId: article.id}});

    // Átadom a lekért adatokat a HTML oldalnak
    res.render("article/article-detail", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      article: article,
      comments: comments, imageUrl: "",
      description: "Știrielmele",
      url: "",
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);
  if (email.length < 5 && password.length < 5) {
    return res.redirect("/login");
  }
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            console.log(user);
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postView = async (req, res, next) => {
  const articleId = req.body.articleId;
  console.log(req.body);
  try {
    await ArticleViewed.create({
      userId: req.user.id,
      articleId: articleId,
      operation: 0,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postAction = async (req, res, next) => {
  const articleId = req.body.articleId;
  console.log(req.body);
  console.log("articleId", articleId);
  // console.log(req.body);
  try {
    await Article.update(
      {
        action: 1,
      },
      { where: { id: articleId } }
    );
    await ArticleAction.create({
      userId: req.user.id,
      articleId: articleId,
      love: 2,
      like: 1,
      unlike: 0,
      comment: "Jó cikk",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postLove = async (req, res, next) => {
  const articleId = req.body.articleId;
  let love = 0;
  const article = await ArticleAction.findOne({
    where: { articleId: articleId },
  });
  love = article.love;
  ++love;

  await ArticleViewed.update(
    {
      operation: 1,
    },
    { where: { articleId: articleId, userId: req.user.id } }
  );
  await ArticleAction.update(
    {
      love: love,
    },
    { where: { articleId: articleId } }
  );
  return res.redirect("/viewed-articles");
};

exports.postLike = async (req, res, next) => {
  const articleId = req.body.articleId;
  let like = 0;
  const article = await ArticleAction.findOne({
    where: { articleId: articleId },
  });
  love = article.like;
  ++like;
  await ArticleViewed.update(
    {
      operation: 1,
    },
    { where: { articleId: articleId, userId: req.user.id } }
  );
  await ArticleAction.update(
    {
      like: like,
    },
    { where: { articleId: articleId } }
  );
  return res.redirect("/viewed-articles");
};

exports.postDislike = async (req, res, next) => {
  const articleId = req.body.articleId;
  let dislike = 0;
  const article = await ArticleAction.findOne({
    where: { articleId: articleId },
  });
  love = article.dislike;
  ++dislike;
  try {
    await ArticleViewed.update(
      {
        operation: 1,
      },
      { where: { articleId: articleId, userId: req.user.id } }
    );
    await ArticleAction.update(
      {
        dislike: dislike,
      },
      { where: { articleId: articleId } }
    );
    res.redirect("/viewed-articles");
  } catch (error) {
    console.log(error);
  }
};
