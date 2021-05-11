const express = require("express");
const router = express.Router();
const dynamicLinkController = require("../controllers/dynamicLinks/dynamicLinks");
const homeController = require("../controllers/home");

router.get("/", homeController.getHome);

// Hírportál adatlapja
router.get("/:channelName", dynamicLinkController.getChannelDetail);

// Hírportál kategóriái
router.get(
  "/:channelName/:categoryName",
  dynamicLinkController.getChannelNewsByCategory
);

// Hírportál cikk adatlapja
router.get(
  "/:channelName/:categoryName/:articleTitle",
  dynamicLinkController.getArticleDetail
);

module.exports = router;
