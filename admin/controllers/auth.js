const bcrypt = require("bcryptjs");
const User = require("../../models/Users");

const { validationResult } = require("express-validator/check");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  if (req.admin != undefined) {
    res.redirect("/admin/orders");
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  // if (req.admin != undefined) {
  //   res.redirect("/admin/orders");
  // }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
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

exports.postSignup = async (req, res, next) => {
  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   return res.json({
  //     status: 400,
  //     msg: "Invalid credentials",
  //     result: [],
  //   });
  // }

  const email = req.body.email;
  const password = req.body.password;

  try {
    // let user = await User.findOne({ where: { email: email } });
    bcrypt.hash(password, 12).then(async (hashedPassword) => {
      const user = await User.create({
        email: email,
        password: hashedPassword,
      });
      // console.log("=-=--==-=-=-=-=-==--=-=", user);
      req.session.isLoggedIn = true;
      req.session.user = user;
      // console.log(432423432, user);

      return req.session.save((err) => {
        console.log(err);
        res.redirect("/stiri");
      });
    });
    // .then((user) => {

    //   return transporter.sendMail({
    //     to: email,
    //     from: "shop@node-complete.com",
    //     subject: "hello bejelentekztel",
    //     html: "<h1>You logged in</h1>",
    //   });
    // });
    // await User.create({
    //   email: email,
    //   password: hashedPassword,
    // });

    // const salt = await bcrypt.genSalt(10);

    // user.password = await bcrypt.hash(password, salt);

    // await user.save();
    // req.session.isLoggedIn = true;
    // req.session.admin = admin;
    // return req.session.save((err) => {
    //   console.log(err);
    //   res.redirect("admin/orders");
    // });
  } catch (err) {
    console.log(err);
    return res.json({
      status: 500,
      msg: "Server error",
      result: [],
    });
  }

  // const email = req.body.email;
  // const password = req.body.password;
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(422).render("auth/signup", {
  //     path: "/signup",
  //     pageTitle: "Signup",
  //     errorMessage: errors.array()[0].msg,
  //     oldInput: {
  //       email: email,
  //       password: password,
  //       confirmPassword: req.body.confirmPassword,
  //     },
  //     validationErrors: errors.array(),
  //   });
  // }
  // bcrypt
  //   .hash(password, 12)
  //   .then(async (hashedPassword) => {
  //     await User.create({
  //       email: email,
  //       password: hashedPassword,
  //     });
  //   })
  //   .then((result) => {
  //     res.redirect("/login");
  //     //   return transporter.sendMail({
  //     //     to: email,
  //     //     from: "shop@node-complete.com",
  //     //     subject: "hello bejelentekztel",
  //     //     html: "<h1>You logged in</h1>",
  //     //   });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     const error = new Error(err);
  //     error.httpStatusCode = 500;
  //     return next(error);
  //   });
};

// router.post(
//   "/register",
//   [
//     check("email", "Please include a valid email").isEmail(),
//     check("name", "Please include a valid name").isLength({ min: 3, max: 20 }),
//     check(
//       "password",
//       "Please enter a password with 6 or more characters"
//     ).isLength({ min: 6, max: 30 }),
//   ],

// );

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
