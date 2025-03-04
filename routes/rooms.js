const express = require("express");
const router = express.Router();
const { roomValidationRules } = require("../validators/roomValidator");
const { createRoom } = require("../controllers/roomsController");
const validateRequest = require("../middlewares/validationRequest");

router.post("/create", roomValidationRules(), validateRequest, createRoom);

module.exports = router;