const bcrypt = require("bcryptjs");
const User = require("../../models/Users");
const Articles = require("../../models/Article");
const Source = require("../../models/Source");
const Category = require("../../models/Category");
const CategoryTranslation = require("../../models/CategoryTranslation");
const UserInterestedCategories = require("../../models/UserInterestedCategories");
const UserInterestedSources = require("../../models/UserInterestedSources");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { validationResult } = require("express-validator/check");
// const { Model } = require("sequelize/types");

exports.getHome = async (req, res, next) => {
  let logged = 0;
  let categories = [];
  let articles = [];
  let interestedCategoryId = [];
  if (req.user != undefined) {
    logged = 1;
    categories = await UserInterestedCategories.findAll({
      where: { userId: req.user.id },
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
    articles = await UserInterestedSources.findAll({
      where: {
        userId: req.user.id,
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
            },
          ],
        },
      ],
    });
    for (let i = 0; i < articles.length; i++) {
      // let test = ;
      for (let k = 0; k < articles[i].Source.Articles.length; k++) {
        console.log(articles[i].Source.Articles[k].title);
      }
      // console.log(test/);
    }
  } else {
    logged = 0;
    categories = await Category.findAll({
      include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
    });
    articles = await Articles.findAll();
  }
  // console.log(articles);
  // const categories = await Category.findAll({
  //   include: [{ model: CategoryTranslation, where: { languageId: 2 } }],
  // });

  //   let message = req.flash("error");
  //   if (message.length > 0) {
  //     message = message[0];
  //   } else {
  //     message = null;
  //   }
  //   if (req.admin != undefined) {
  //     res.redirect("/admin/orders");
  //   }

  res.render("home/index", {
    path: "/login",
    pageTitle: "Login",
    articles: articles,
    categories: categories,
    logged: logged,
    // errorMessage: message,
    // oldInput: {
    //   email: "",
    //   password: "",
    // },
    // validationErrors: [],
  });
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
