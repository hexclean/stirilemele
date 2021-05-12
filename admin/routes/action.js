const express = require("express");
const { check, body } = require("express-validator/check");

const actionController = require("../controllers/action");

const router = express.Router();

router.post("/send-comment", actionController.postAddComment);

module.exports = router;
