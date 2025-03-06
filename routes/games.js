const express = require("express");
const router = express.Router();
const {createGame, allGames} = require("../controllers/gamesController");
const errorHandler = require("../middlewares/errorHandler")
const validateRequest = require("../middlewares/validationRequest")
router.use(errorHandler);

router.get("/", validateRequest,allGames),
router.post("/", validateRequest,createGame),

module.exports = router;