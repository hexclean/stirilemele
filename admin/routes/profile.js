const express = require("express");
const profileController = require("../controllers/profile");
const actionController = require("../controllers/action");
const isAuth = require("../../middleware/is-auth");

const router = express.Router();

// Profil
router.get("/", isAuth, profileController.getPrimaryData);
router.get("/newsletter", isAuth, profileController.getNewsletter);
router.get("/select-category", isAuth, profileController.getCategoryEditing);
router.get("/select-channel", isAuth, profileController.getChannelEditing);
router.get("/send-email", isAuth, profileController.getSendEmailEndOfTheDay);
router.get("/email-sender", isAuth, profileController.getEmailSender);

router.get("/history", isAuth, actionController.getHistoryArticles);
router.get("/contact", isAuth, profileController.getContact);

module.exports = router;
