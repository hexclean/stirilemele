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

exports.getHome = async (req, res, next) => {
  let logged = 0;
  let categories = [];
  let articles = [];
  let interestedCategoryId = [];
  try {
    if (req.user != undefined) {
      logged = 1;
      categories = await UserInterestedCategories.findAll({
        where: { userId: req.user.id, active: 1 },
        include: [
          {
            model: Category,
            include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
          },
        ],
      });
      for (let i = 0; i < categories.length; i++) {
        interestedCategoryId.push(categories[i].categoryId);
      }
      // console.log(interestedCategoryId);
      articles = await UserInterestedSources.findAll({
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
    } else {
      logged = 0;
      categories = await Category.findAll({
        where: { secondary: 1 },
        include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
      });
      articles = await Articles.findAll({
        order: [["createdAt", "ASC"]],
        include: [
          {
            model: Source,
          },
          { model: Category },
        ],
      });
    }
    res.render("home/index", {
      path: "/login",
      pageTitle: "Login",
      articles: articles,
      categories: categories,
      logged: logged,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getTest = async (req, res, next) => {
  const articles = await Articles.findAll();

  //   let message = req.flash("error");
  //   if (message.length > 0) {
  //     message = message[0];
  //   } else {
  //     message = null;
  //   }
  //   if (req.admin != undefined) {
  //     res.redirect("/admin/orders");
  //   }

  res.render("home/test", {
    path: "/login",
    pageTitle: "Login",
    articles: articles,

    // errorMessage: message,
    // oldInput: {
    //   email: "",
    //   password: "",
    // },
    // validationErrors: [],
  });
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
    include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
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
  //   include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
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
