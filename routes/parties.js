const express = require("express");
const router = express.Router();
const {allParties,partyById, joinPartyByJoinId,createParty,joinParty} = require("../controllers/partiesController");
const errorHandler = require("../middlewares/errorHandler")
const validateRequest = require("../middlewares/validationRequest")
router.use(errorHandler);


router.get("/", validateRequest, allParties),
router.get("/:id", validateRequest, partyById),
router.post("/", validateRequest, createParty),
router.put("/", validateRequest,joinPartyByJoinId);
router.post("/join", validateRequest, joinParty), //matchmaking



module.exports = router;