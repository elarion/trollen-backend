const express = require("express");
const {
    userValidationRules,
    signInValidationRules,
    guestValidationRules,
} = require("../validators/userValidator");
const {
    preSignup,
    signup,
    signin,
    signupGuest
} = require("../controllers/usersController");

/** Middlewares */
const validateRequest = require("../middlewares/validateRequest");
const errorHandler = require("../middlewares/errorHandler");

/** Router */
const router = express.Router();

router.use(errorHandler);
// reminder, router.use(mymiddleware) is the same as app.use(middleware) 
// but it will applyied to all routes in this router and not over all the application's routers
// it's also the same as doing router.post("/route", mymiddleware, (req, res) => {})
// router.use(mymiddleware) will apply for all the routes after it
// so if you put it after the pre-signup route, it will apply for all the routes after it and not the pre-signup one

router.post("/pre-signup", userValidationRules(), validateRequest, preSignup);
router.post("/signup", userValidationRules(true), validateRequest, signup);
router.post("/signin", signInValidationRules(), validateRequest, signin);
router.post("/signup-guest", guestValidationRules(), validateRequest, signupGuest);

module.exports = router;