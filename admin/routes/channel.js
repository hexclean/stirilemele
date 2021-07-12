const express = require("express");
const channelController = require("../controllers/channels");
const router = express.Router();

// Hírportálok betöltése
router.get("/", channelController.getAllChannel);
router.get("/:channelName", channelController.getChannelCategories);
router.get("/:channelName/:categoryName", channelController.getChannelCategory);
router.post("/follow-source", channelController.postFollowSource);
router.post("/unfollow-source", channelController.postUnFollowSource);
module.exports = router;
