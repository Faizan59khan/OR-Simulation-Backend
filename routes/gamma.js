const express = require("express");

const router = express.Router(); //Router will give special object through which we can register middleware.
const gammaController = require("../controllers/gamma");

router.get("/gamma", gammaController.gammaDistributions);
module.exports = router;
