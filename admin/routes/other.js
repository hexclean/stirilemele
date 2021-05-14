const express = require("express");
const router = express.Router();
const dynamicLinkController = require("../controllers/dynamicLinks/dynamicLinks");
const otherController = require("../controllers/other");
const sourceController = require("../controllers/source");

// Főoldal
router.get("/categorii", otherController.getCategoryScreen);
router.get("/top", otherController.getTopArticles);
router.get("/comment-email", otherController.getTopArticles);
router.get("/channels", otherController.getChannels);
module.exports = router;
