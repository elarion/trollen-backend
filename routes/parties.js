const express = require("express");
const router = express.Router();
const {allParties,partyById, joinPartyById} = require("../controllers/partiesController");
const errorHandler = require("../middlewares/errorHandler")
const validateRequest = require("../middlewares/validationRequest")
router.use(errorHandler);


router.get("/", validateRequest, allParties),
router.get("/:id", validateRequest, partyById),
router.put("/:id", validateRequest,joinPartyById);



module.exports = router;