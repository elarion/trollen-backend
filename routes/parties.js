const express = require("express");
const router = express.Router();
const partiesController = require("../controllers/partiesController");
const errorHandler = require("../middlewares/errorHandler")
// const validateRequest = require("../middlewares/validationRequest")
const authenticateToken = require("../middlewares/authenticateToken")

router.use(errorHandler);

router.get("/", authenticateToken, partiesController.allParties);
router.get("/:id", authenticateToken, partiesController.partyById);
router.post("/create", authenticateToken, partiesController.createParty);
router.put("/join-by-id", authenticateToken, partiesController.joinPartyByJoinId);
router.put("/join-random", authenticateToken, partiesController.joinParty);

module.exports = router;