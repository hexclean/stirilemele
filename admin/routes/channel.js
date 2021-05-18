const express = require("express");
const channelController = require("../controllers/channels");
const router = express.Router();

// Hírportálok betöltése
router.get("/", channelController.getAllChannel);
router.get("/:channelName", channelController.getChannelCategories);

module.exports = router;
