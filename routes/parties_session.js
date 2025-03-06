const express = require("express");
const router = express.Router();
const {startParty} = require("../controllers/partySessionsController");
const errorHandler = require("../middlewares/errorHandler")
const validateRequest = require("../middlewares/validationRequest")
router.use(errorHandler);

router.post("/:id", validateRequest, startParty),
module.exports = router;