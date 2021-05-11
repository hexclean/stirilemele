const express = require("express");
const homeController = require("../controllers/home");
const authController = require("../controllers/auth");
const articleController = require("../controllers/ArticleDetail");
const commentController = require("../controllers/comment");
const categoryController = require("../controllers/category");
const stepsController = require("../controllers/steps");
const isAuth = require("../../middleware/is-auth");
const router = express.Router();
const sourceController = require("../controllers/source");
// Dinamikus link mappa //
const dynamicLinkController = require("../controllers/dynamicLinks/dynamicLinks");
// Dinamikus linkek
router.get("/:channelName", dynamicLinkController.getChannelDetail);
// Hírportál hírei kategória szerint
router.get(
  "/:channelName/:categoryName",
  dynamicLinkController.getChannelNewsByCategory
);

router.get(
  "/:channelName/:categoryName/:articleTitle",
  dynamicLinkController.getArticleDetail
);

// Kategória oldal
// router.get("/stiri/categorii", categoryController.getAllCategoryScreen);

// // Összes hírportál
// router.get("/channels", sourceController.getViewChannels);

// Hírportál adatlapja

// Configure steps
// router.get(
//   "/selectati-categorii",
//   isAuth,
//   stepsController.getSelectInterestedCategory
// );
// router.post(
//   "/add-favourite-category",
//   isAuth,
//   stepsController.postAddFavouriteCategory
// );

// router.post(
//   "/add-favourite-channel",
//   isAuth,
//   stepsController.postAddFavouriteChannel
// );

// router.get(
//   "/selectati-channel",
//   isAuth,
//   stepsController.getSelectInterestedChannel
// );

// LISTS
router.get("/", homeController.getHome);
// router.get("/test", homeController.getTest);
// router.get("/signup", authController.getSignup);
// router.post("/signup", authController.postSignup);
// router.get("/login", authController.getLogin);

// router.post("/login", authController.postLogin);

// router.get("/option", homeController.getOption);
// router.get("/viewed-articles", homeController.getViewedArticle);

// router.post("/option", homeController.postOption);

// router.post("/article-action", articleController.postAction);

// router.post("/article-view", articleController.postView);
// //action
// router.post("/article-like", articleController.postLike);
// router.post("/article-love", articleController.postLove);
// router.post("/article-dislike", articleController.postDislike);

// router.get("/stiri/:articleName", articleController.getViewArticle);
// router.get("/stiri/categorii", sourceController.getViewSource);

// router.get(
//   "/stiri/:newsPortal/:categoryName",
//   sourceController.getViewSourceCategory
// );

// router.get(
//   "/stiri/:sourceName/:categoryName/:title",
//   homeController.getViewedArticleFromHome
// );

// Add comment to the article
// router.post("/add-comment", commentController.postAddComment);

module.exports = router;
