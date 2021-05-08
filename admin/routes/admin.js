const express = require("express");
const homeController = require("../controllers/home");
const authController = require("../controllers/auth");
const isAuth = require("../../middleware/is-auth");
const router = express.Router();

// LISTS
router.get("/stiri", homeController.getHome);
router.get("/test", homeController.getTest);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

module.exports = router;
