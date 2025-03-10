const express = require("express");
const router = express.Router();
const {reportUser} = require("../controllers/usersReportsController");
const errorHandler = require("../middlewares/errorHandler")
// const validateRequest = require("../middlewares/validationRequest")
router.use(errorHandler);

router.post("/:id", reportUser),

module.exports = router;