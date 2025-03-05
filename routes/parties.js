const express = require("express");
const router = express.Router();
const {allParties} = require("../controllers/partiesController");
const errorHandler = require("../middlewares/errorHandler")
const validateRequest = require("../middlewares/validationRequest")

router.get("/", validateRequest, allParties),


router.use(errorHandler);
module.exports = router;