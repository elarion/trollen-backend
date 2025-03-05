const express = require("express");
const router = express.Router();
const {allRaces,getRaceByName, addRace} = require("../controllers/racesController");
const errorHandler = require("../middlewares/errorHandler")
const validateRequest = require("../middlewares/validationRequest")

router.get("/", validateRequest, allRaces),
router.get("/:name", validateRequest, getRaceByName),
router.post("/", validateRequest, addRace)


router.use(errorHandler);
module.exports = router;