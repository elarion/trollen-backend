const express = require("express");
const {
    signInValidationRules,
    guestValidationRules,
    userValidationRules
} = require("../validators/userValidator");
const validateRequest = require("../middlewares/validationRequest");
const { preSignup, signup, signin, signupGuest, logout, modifyProfile } = require("../controllers/usersController");
const errorHandler = require("../middlewares/errorHandler");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.post("/pre-signup", userValidationRules(), validateRequest, preSignup);
router.post("/signup", userValidationRules(true), validateRequest, signup);
router.post("/signin", signInValidationRules(), validateRequest, signin);
router.post("/signup-guest", guestValidationRules(), validateRequest, signupGuest);
router.post('/logout', authenticateToken,  logout);
router.put('/modify-profile', /*authenticateToken, userValidationRules, validateRequest,*/ modifyProfile)

router.use(errorHandler);
// reminder, router.use(mymiddleware) is the same as app.use(middleware) 
// but it will applyied to all routes in this router and not over all the application's routers
// it's also the same as doing router.post("/route", mymiddleware, (req, res) => {})
// router.use(mymiddleware) will apply for all the routes after it
// so if you put it after the pre-signup route, it will apply for all the routes after it and not the pre-signup one

module.exports = router;
