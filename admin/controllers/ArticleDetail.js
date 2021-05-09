const Article = require("../../models/Article");
const Source = require("../../models/Source");
const ArticleViewed = require("../../models/ArticleViewed");

exports.getViewArticle = async (req, res, next) => {
  const editMode = req.query.edit;
  const articleName = req.params.articleName;

  try {
    const article = await Article.findOne({
      where: {
        title: articleName,
      },
      include: [
        {
          model: Source,
        },
      ],
    });
    // Átadom a lekért adatokat a HTML oldalnak
    res.render("article/article-detail", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      article: article,
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
              res.redirect("/stiri");
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
    });
  } catch (error) {
    console.log(error);
  }
};
