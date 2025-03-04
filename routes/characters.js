const express = require("express");
const { characterValidationRules } = require("../validators/characterValidator");
const { createCharacter } = require("../controllers/charactersController");
const validateRequest = require("../middlewares/validationRequest");
const errorHandler = require("../middlewares/errorHandler");

const router = express.Router();

// Error handler middleware
router.use(errorHandler);

router.post("/create",
    characterValidationRules, // apply validation rules
    validateRequest,           // validate request data or not
    createCharacter
);

module.exports = router;
