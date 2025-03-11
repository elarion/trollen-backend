const express = require("express");
const router = express.Router();
const { allParties, partyById, joinPartyByJoinId, createParty, joinParty } = require("../controllers/partiesController");
const errorHandler = require("../middlewares/errorHandler")
const validateRequest = require("../middlewares/validationRequest")
const authenticateToken = require("../middlewares/authenticateToken")

router.use(errorHandler);

router.get("/", authenticateToken, allParties);
router.get("/:id", authenticateToken, partyById);
router.post("/create", authenticateToken, createParty);
router.put("/", authenticateToken, joinPartyByJoinId);
router.post("/join", authenticateToken, joinParty); //matchmaking



module.exports = router;