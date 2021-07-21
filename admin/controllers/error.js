exports.get404 = (req, res, next) => {
  let cookie = req.cookies.cookie;
  let logged = 0;
  if (req.user != undefined) {
    logged = 1;
  } else {
    logged = 0;
  }
  res.status(404).render("includes/404", {
    pageTitle: "Page Not Found",
    path: "/404",
    isAuthenticated: req.session.isLoggedIn,
    logged: logged,
    cookie: cookie,
    imageUrl: "",
    description: "Știrielmele",
    url: "",
  });
};

exports.get500 = (req, res, next) => {
  let cookie = req.cookies.cookie;
  res.status(500).render("includes/404", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
    cookie: cookie,
    imageUrl: "",
    description: "Știrielmele",
    url: "",
  });
};
