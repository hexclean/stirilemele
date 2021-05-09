const express = require("express");
const homeController = require("../controllers/home");
const authController = require("../controllers/auth");
const articleController = require("../controllers/ArticleDetail");
const isAuth = require("../../middleware/is-auth");
const router = express.Router();

// LISTS
router.get("/stiri", homeController.getHome);
router.get("/test", homeController.getTest);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/option", homeController.getOption);
router.get("/viewed-articles", homeController.getViewedArticle);
router.post("/option", homeController.postOption);

router.post("/article-view", articleController.postView);

router.get("/stiri/:articleName", articleController.getViewArticle);

module.exports = router;
