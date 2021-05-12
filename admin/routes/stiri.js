const express = require("express");
const router = express.Router();
const dynamicLinkController = require("../controllers/dynamicLinks/dynamicLinks");
const homeController = require("../controllers/home");
const sourceController = require("../controllers/source");

// Főoldal
router.get("/", homeController.getHome);

// Kategória hírei
router.get("/:categoryName", dynamicLinkController.getSelectedCategoryArticles);

// Hírportál kategóriái
router.get(
  "/:categoryName/:channelName",
  dynamicLinkController.getChannelNewsByCategory
);

// Hírportál cikk adatlapja
router.get(
  "/:categoryName/:channelName/:articleTitle",
  dynamicLinkController.getArticleDetail
);

module.exports = router;
