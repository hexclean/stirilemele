const express = require("express");
const router = express.Router();
const dynamicLinkController = require("../controllers/dynamicLinks/dynamicLinks");
const homeController = require("../controllers/home");
const sourceController = require("../controllers/source");

// Főoldal
router.get("/", homeController.getHome);

// Kategória hírei
router.get(
  "/stiri/:categoryName",
  dynamicLinkController.getSelectedCategoryArticles
);

// Hírportál cikk adatlapja
router.get(
  "/stiri/:categoryName/:channelName/:articleTitle",
  dynamicLinkController.getArticleDetail
);

module.exports = router;
