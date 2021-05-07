const express = require("express");
const maszolController = require("../maszol");
const router = express.Router();

// MASZOL.RO
router.post("/maszol-sport", isAuth, maszolController.postSport);

module.exports = router;
