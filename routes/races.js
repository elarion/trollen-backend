const express = require("express");
const router = express.Router();
const {allRaces,getRaceByName} = require("../controllers/racesController");
const errorHandler = require("../middlewares/errorHandler")
const validateRequest = require("../middlewares/validationRequest")
router.use(errorHandler);

router.get("/", validateRequest,allRaces),
router.get("/:name", validateRequest,getRaceByName),


module.exports = router;