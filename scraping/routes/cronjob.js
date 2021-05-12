const express = require("express");
const maszolSportController = require("../maszol/sport");
const maszolSpodasdartController = require("../digi24/politica-secondary");
const mediafaxPoliticaController = require("../mediafax/politica");
const cancanSportController = require("../cancan/sport");
const newsPoliticController = require("../news/politic");
const kronikaonlinePoliticController = require("../kronikaonline/belfold");
const szatmarPoliticController = require("../szatmar/politika");
const b1Controller = require("../b1/index");
const romaniatv = require("../romaniatv/politica");
const szekelyhon = require("../szekelyhon/politica");
const stirilepesurse = require("../stirilepesurse/politic");
const transindex = require("../transindex/politic");
const libertea = require("../libertatea/index");
const stirileprotv = require("../stirileprotv/index");
const jurulnat = require("../jurulnat/index");
const digi24 = require("../digi24/politica-secondary");
const router = express.Router();

// https://www.b1.ro
router.post("/b1-politics", b1Controller.postPolitics);
router.post("/b1-sport", b1Controller.postSport);
router.post("/b1-economic", b1Controller.postEconomic);

// // MASZOL.RO
router.post("/maszol-sport", maszolSportController.postSport);
router.post("/digi24-sport", digi24.postPoliticaSecondary);

// router.post(
//   "/digi24-politica-secondary",
//   maszolSpodasdartController.postPoliticaSecondary
// );
// router.post(
//   "/digi24-politica-primary",
//   maszolSpodasdartController.postPoliticaPrimary
// );
// router.post("/mediafax-politica", mediafaxPoliticaController.postPolitica);
router.post("/cancan-sport", cancanSportController.postSport);
// router.post(
//   "/kronikaonline-belfold",
//   kronikaonlinePoliticController.postBelfold
// );

// router.post("/szatmar-sport", szatmarPoliticController.postBelfold);
// router.post("/b1-sport", b1PoliticController.postBelfold);
// router.post("/romaniatv-sport", romaniatv.postBelfold);
// router.post("/szekelyhon-sport", szekelyhon.postBelfold);
// router.post("/transindex-sport", transindex.postBelfold);
// router.post("/stirileprotv-sport", stirileprotv.postBelfold);
// router.post("/jurulnat-sport", jurulnat.postBelfold);

module.exports = router;
