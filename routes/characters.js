const express = require("express");
const { characterValidationRules } = require("../validators/characterValidator");
const { createCharacter } = require("../controllers/charactersController");
const validateRequest = require("../middlewares/validationRequest");
const errorHandler = require("../middlewares/errorsHandler");

const router = express.Router();

// Error handler middleware
router.use(errorHandler);

router.post("/create",
    characterValidationRules(), // apply validation rules
    validateRequest,           // validate request data or not
    async (req, res, next) => {
        try {
            const { user, race, gender, avatar } = req.body;
            const character = await createCharacter({ user, race, gender, avatar });

            res.status(201).json({ success: true, character });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
