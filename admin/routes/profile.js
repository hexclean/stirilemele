const express = require("express");
const profileController = require("../controllers/profile");
const actionController = require("../controllers/action");
const isAuth = require("../../middleware/is-auth");

const router = express.Router();

// Profil betöltése
router.get("/", isAuth, profileController.getPrimaryData);
router.get("/newsletter", isAuth, profileController.getNewsletter);

router.get("/select-category", isAuth, profileController.getCategoryEditing);
router.get("/select-channel", isAuth, profileController.getChannelEditing);
router.get("/send-email", isAuth, profileController.getSendEmailEndOfTheDay);
router.get("/email-sender", isAuth, profileController.getEmailSender);
router.get("/history", isAuth, actionController.getHistoryArticles);
router.get("/contact", isAuth, profileController.getContact);
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
