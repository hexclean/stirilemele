const bcrypt = require("bcryptjs");
const User = require("../../models/Users");

const { validationResult } = require("express-validator/check");

exports.getHome = (req, res, next) => {
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
