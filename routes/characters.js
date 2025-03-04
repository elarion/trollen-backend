const express = require("express");
const { characterValidationRules } = require("../validators/characterValidator");
const { getCharacterByUserId, getAllCharactersByUserId, createCharacter } = require("../controllers/charactersController");
const validateRequest = require("../middlewares/validationRequest");
const errorHandler = require("../middlewares/errorHandler");

const router = express.Router();


router.get("/:userId", getCharacterByUserId);
router.get("/:characterId/:userId", getAllCharactersByUserId);
router.post("/create",
    characterValidationRules,
    validateRequest,
    createCharacter
);


// Error handler middleware
router.use(errorHandler);

module.exports = router;
