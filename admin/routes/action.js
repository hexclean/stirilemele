const express = require("express");
const { check, body } = require("express-validator/check");

const actionController = require("../controllers/action");

const router = express.Router();

router.post("/send-comment", actionController.postAddComment);
router.post("/edit-channels", actionController.postEditChannels);
router.post("/edit-categories", actionController.postEditCategory);
router.post("/send-email-days", actionController.postSendEmailDay);
router.post("/save-article", actionController.postSendpostSaveToHistory);

module.exports = router;
