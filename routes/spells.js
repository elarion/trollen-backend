const express = require("express");
const { spellValidationRules } = require("../validators/spellValidators");
const validateRequest = require("../middlewares/validationRequest")
const { addSpell, getSpell } = require("../controllers/spellsController");
const errorHandler = require("../middlewares/errorHandler")

const router = express.Router();

router.use(errorHandler);

// reminder, router.use(mymiddleware) is the same as app.use(middleware) 
// but it will applyied to all routes in this router and not over all the application's routers
// it's also the same as doing router.post("/route", mymiddleware, (req, res) => {})
// router.use(mymiddleware) will apply for all the routes after it
// so if you put it after the pre-signup route, it will apply for all the routes after it and not the pre-signup one

router.post("/", spellValidationRules(), validateRequest, addSpell)
//router.get("/", getSpell())

module.exports = router;