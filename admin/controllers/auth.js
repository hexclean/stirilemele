const bcrypt = require("bcryptjs");
const User = require("../../models/Users");
const Channels = require("../../models/Source");
const Category = require("../../models/Category");

const { validationResult } = require("express-validator/check");
const UserInterestedCategories = require("../../models/UserInterestedCategories");
const UserInterestedSources = require("../../models/UserInterestedSources");
const SendEmailCategory = require("../../models/SendEmailCategory");
const SendEmailSource = require("../../models/SendEmailSource");

exports.getLogin = async (req, res, next) => {
  if (req.user != undefined) {
    await res.redirect("/stiri");
  }
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    // errorMessage: message,
    // oldInput: {
    //   email: "",
    //   password: "",
    // },
    // validationErrors: [],
  });
};

exports.getSignup = async (req, res, next) => {
  if (req.user != undefined) {
    await res.redirect("/stiri");
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
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/");
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email.length < 5 && password.length < 5) {
    return res.redirect("/login");
  }
  let categories = await Category.findAll();
  let channels = await Channels.findAll();

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
        res.redirect("/profile");
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

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
