const express = require("express");
const router = express.Router();
// const dynamicLinkController = require("../controllers/dynamicLinks/dynamicLinks");
const otherController = require("../controllers/other");
// const sourceController = require("../controllers/source");
const isAuth = require("../../middleware/is-auth");

// Főoldal
router.get("/categorii", otherController.getCategoryScreen);
router.get("/stiri-configurate", isAuth, otherController.getConfiguredHome);
router.get("/important", otherController.getFontos);
router.get("/contact", otherController.getContact);
router.get("/cookie", otherController.getCookie);
router.get("/cookie-table", otherController.getCookieTable);
router.get("/success", otherController.getSuccess);

module.exports = router;
