const express = require("express");
const homeController = require("../controllers/home");
const isAuth = require("../../middleware/is-auth");
const router = express.Router();

// LISTS
router.get("/toate-stiri", homeController.getHome);

module.exports = router;
