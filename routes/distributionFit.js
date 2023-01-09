const express = require("express");

const router = express.Router(); //Router will give special object through which we can register middleware.
const disFitController = require("../controllers/distributionFit");
const uniformController = require("../controllers/uniform");
const poissonContriller = require("../controllers/poisson");

router.get("/disFit", disFitController.distributions);
router.get("/uniform", uniformController.uniformDistributions);
router.get("/poisson", poissonContriller.poissonDistributions);
module.exports = router;
