const express = require("express");
const router = express.Router();
const {allParties,joinPartyById} = require("../controllers/partiesController");
const errorHandler = require("../middlewares/errorHandler")
const validateRequest = require("../middlewares/validationRequest")

router.get("/", validateRequest, allParties),
router.get("/id", validateRequest, partyById),


router.use(errorHandler);
module.exports = router;