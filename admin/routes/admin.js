const express = require("express");

const isAuth = require("../../middleware/is-auth");
const router = express.Router();

// LISTS
// router.get("/subcategories", isAuth, listsController.getSubcategories);

module.exports = router;
