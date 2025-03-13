const express = require("express");
const router = express.Router();
const { reportUser } = require("../controllers/usersReportsController");
const errorHandler = require("../middlewares/errorHandler")
const authenticateToken = require("../middlewares/authenticateToken")
router.use(errorHandler);

router.post("/:id", authenticateToken, reportUser),

    module.exports = router;