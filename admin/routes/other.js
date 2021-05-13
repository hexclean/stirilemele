const express = require("express");
const router = express.Router();
const dynamicLinkController = require("../controllers/dynamicLinks/dynamicLinks");
const otherController = require("../controllers/other");
const sourceController = require("../controllers/source");

// Főoldal
router.get("/categorii", otherController.getCategoryScreen);
router.get("/history", otherController.getHistoryArticles);
router.get("/top", otherController.getTopArticles);

module.exports = router;
