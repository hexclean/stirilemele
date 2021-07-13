const bcrypt = require("bcryptjs");
const User = require("../../models/Users");
const Channels = require("../../models/Source");
const Category = require("../../models/Category");
const ArticleViewed = require("../../models/ArticleViewed");

const { validationResult } = require("express-validator/check");
const UserInterestedCategories = require("../../models/UserInterestedCategories");
const UserInterestedSources = require("../../models/UserInterestedSources");
const SendEmailCategory = require("../../models/SendEmailCategory");
const SendEmailSource = require("../../models/SendEmailSource");

exports.getLogin = async (req, res, next) => {
  if (req.user != undefined) {
    await res.redirect("/");
  }
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/autentificare/login",
    pageTitle: "Login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.getSignup = async (req, res, next) => {
  if (req.user != undefined) {
    await res.redirect("/");
  }
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  await User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Email sau parola invalidă!",
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Email sau parola invalidă!",
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: [],
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  let categories = await Category.findAll();
  let channels = await Channels.findAll();

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  try {
    await bcrypt.hash(password, 12).then(async (hashedPassword) => {
      const user = await User.create({
        email: email,
        password: hashedPassword,
      });

      req.session.isLoggedIn = true;
      req.session.user = user;

      for (let i = 0; i < categories.length; i++) {
        await UserInterestedCategories.create({
          userId: user.id,
          categoryId: categories[i].id,
          active: 1,
        });
        await SendEmailCategory.create({
          userId: user.id,
          categoryId: categories[i].id,
          active: 1,
        });
      }
      for (let i = 0; i < channels.length; i++) {
        await UserInterestedSources.create({
          userId: user.id,
          sourceId: channels[i].id,
          active: 1,
        });
        await SendEmailSource.create({
          userId: user.id,
          sourceId: channels[i].id,
          active: 1,
        });
      }

      return req.session.save((err) => {
        console.log(err);
        res.redirect("/help");
      });
    });
  } catch (err) {
    console.log(err);
    return res.json({
      status: 500,
      msg: "Server error",
      result: [],
    });
  }
};

// exports.postSignup = async (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   if (email.length < 5 && password.length < 5) {
//     return res.redirect("/autentificare/inregistrare");
//   }
//   let categories = await Category.findAll();
//   let channels = await Channels.findAll();

//   try {
//     await bcrypt.hash(password, 12).then(async (hashedPassword) => {
//       const user = await User.create({
//         email: email,
//         password: hashedPassword,
//       });

//       req.session.isLoggedIn = true;
//       req.session.user = user;

//       for (let i = 0; i < categories.length; i++) {
//         await UserInterestedCategories.create({
//           userId: user.id,
//           categoryId: categories[i].id,
//           active: 1,
//         });
//         await SendEmailCategory.create({
//           userId: user.id,
//           categoryId: categories[i].id,
//           active: 1,
//         });
//       }
//       for (let i = 0; i < channels.length; i++) {
//         await UserInterestedSources.create({
//           userId: user.id,
//           sourceId: channels[i].id,
//           active: 1,
//         });
//         await SendEmailSource.create({
//           userId: user.id,
//           sourceId: channels[i].id,
//           active: 1,
//         });
//       }

//       return req.session.save((err) => {
//         console.log(err);
//         res.redirect("/help");
//       });
//     });
//   } catch (err) {
//     console.log(err);
//     return res.json({
//       status: 500,
//       msg: "Server error",
//       result: [],
//     });
//   }
// };

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.postDeleteAccount = async (req, res, next) => {
  await User.destroy({ where: { id: req.user.id } });
  await UserInterestedCategories.destroy({ where: { userId: req.user.id } });
  await UserInterestedSources.destroy({ where: { userId: req.user.id } });
  await ArticleViewed.destroy({ where: { userId: req.user.id } });
  res.redirect("/");
};
