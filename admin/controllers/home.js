const bcrypt = require("bcryptjs");
const User = require("../../models/Users");
const Articles = require("../../models/Article");
const Source = require("../../models/Source");
const Category = require("../../models/Category");
const CategoryTranslation = require("../../models/CategoryTranslation");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var timeAgo = require("node-time-ago");
const Article = require("../../models/Article");
const ArticleViewed = require("../../models/ArticleViewed");
const ArticleComment = require("../../models/ArticleComment");
const TODAY_START = new Date().setHours(0, 0, 0, 0);
const NOW = new Date();
const ITEMS_PER_PAGE = 28;
const { getLanguageCode } = require("../../shared/language");

exports.getHome = async (req, res, next) => {
  const languageCode = getLanguageCode(req.cookies.language);
  const page = +req.query.page || 1;
  let totalItems;
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  try {
    const sources = await Source.findAll();
    const bestArticles = await Articles.findAll({
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW,
      },
      order: [["clicked", "DESC"]],
      limit: 4,
      include: [
        { model: Source },
        {
          model: Category,
          include: [
            { model: CategoryTranslation, where: { languageId: languageCode } },
          ],
        },
      ],
    });
    await Articles.findAll({
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW,
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
    })
      .then(async (numArticles) => {
        totalItems = numArticles;

        return await Articles.findAll({
          createdAt: {
            [Op.gt]: TODAY_START,
            [Op.lt]: NOW,
          },
          offset: (page - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
          include: [
            {
              model: Category,
              include: [
                {
                  model: CategoryTranslation,
                  where: { languageId: languageCode },
                },
              ],
            },
            { model: Source },
          ],
        });
      })
      .then((articles) => {
        console.log(page);
        res.render("home/index", {
          path: "/login",
          pageTitle: "Știrilemele",
          articles: articles.reverse(),
          logged: logged,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems.length,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalItems.length / ITEMS_PER_PAGE),
          currentPage: page,
          sources: sources,
          bestArticles: bestArticles,
        });
      });
  } catch (error) {
    console.log(error);
  }
};

exports.getSignup = (req, res, next) => {
  if (req.admin != undefined) {
    res.redirect("/admin/orders");
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ where: { email: email, commission: 0 } })
    .then((admin) => {
      if (!admin) {
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, admin.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.admin = admin;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("admin/orders");
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

exports.getOption = async (req, res, next) => {
  const sources = await Source.findAll();
  const categories = await Category.findAll({
    include: [
      { model: CategoryTranslation, where: { languageId: languageCode } },
    ],
  });
  console.log(req.body);

  res.render("home/option", {
    path: "/login",
    pageTitle: "Login",
    sources: sources,
    categories: categories,
    // logged: logged,
    // errorMessage: message,
    // oldInput: {
    //   email: "",
    //   password: "",
    // },
    // validationErrors: [],
  });
};

exports.postOption = async (req, res, next) => {
  // const filteredStatus = req.body.sourcesId.filter(Boolean);
  console.log(req.body);
  // for (let i = 0; i <= filteredStatus.length - 1; i++) {
  // await CategoryProperty.create({
  //   categoryId: categoryId,
  //   propertyId: propertyId[i],
  //   active: filteredStatus[i] == "on" ? 1 : 0,
  //   restaurantId: restaurantId,
  // });
  // console.log(filteredStatus[i] == "on" ? 1 : 0);
  // }
  return res.redirect("/option");
  // const sources = await Source.findAll();
  // const categories = await Category.findAll({
  //   include: [{ model: CategoryTranslation, where: { languageId: languageCode} }],
  // });
  // console.log(req.body);
  // res.render("home/option", {
  //   path: "/login",
  //   pageTitle: "Login",
  //   sources: sources,
  //   categories: categories,
  // logged: logged,
  // errorMessage: message,
  // oldInput: {
  //   email: "",
  //   password: "",
  // },
  // validationErrors: [],
  // });
};

exports.getViewedArticleFromHome = async (req, res, next) => {
  const editMode = req.query.edit;
  const articleName = req.params.title;

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
    const comments = await ArticleComment.findAll({
      include: [{ model: User }],
    });
    // Átadom a lekért adatokat a HTML oldalnak
    res.render("article/article-detail", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      article: article,
      comments: comments,
    });
  } catch (err) {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getViewedSourceDetail = async (req, res, next) => {
  let logged = 0;
  let categories = [];

  let interestedCategoryId = [];

  const articles = await ArticleViewed.findAll({
    where: { userId: req.user.id },
    include: [{ model: Article }],
  });

  res.render("article/viewed-article", {
    path: "/login",
    pageTitle: "Login",
    articles: articles,
    categories: categories,
    logged: logged,
  });
};
