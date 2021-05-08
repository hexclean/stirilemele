const express = require("express");
const maszolSportController = require("../maszol/sport");
const maszolSpodasdartController = require("../digi24/politica-secondary");
const mediafaxPoliticaController = require("../mediafax/politica");
const cancanSportController = require("../cancan/sport");
const newsPoliticController = require("../news/politic");
const kronikaonlinePoliticController = require("../kronikaonline/belfold");
const szatmarPoliticController = require("../szatmar/politika");
const b1PoliticController = require("../b1/politica");
const romaniatv = require("../romaniatv/politica");
const szekelyhon = require("../szekelyhon/politica");
const stirilepesurse = require("../stirilepesurse/politic");
const router = express.Router();

// MASZOL.RO
router.post("/maszol-sport", maszolSportController.postSport);
router.post(
  "/digi24-politica-secondary",
  maszolSpodasdartController.postPoliticaSecondary
);
router.post(
  "/digi24-politica-primary",
  maszolSpodasdartController.postPoliticaPrimary
);
router.post("/mediafax-politica", mediafaxPoliticaController.postPolitica);
router.post("/cancan-sport", cancanSportController.postSport);
router.post(
  "/kronikaonline-belfold",
  kronikaonlinePoliticController.postBelfold
);

router.post("/szatmar-sport", szatmarPoliticController.postBelfold);
router.post("/b1-sport", b1PoliticController.postBelfold);
router.post("/romaniatv-sport", romaniatv.postBelfold);
router.post("/szekelyhon-sport", szekelyhon.postBelfold);
router.post("/stirilepesurse-sport", stirilepesurse.postBelfold);

module.exports = router;
