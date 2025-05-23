const express = require("express");
const {
    signInValidationRules,
    guestValidationRules,
    userValidationRules,

} = require("../validators/userValidator");
const validateRequest = require("../middlewares/validationRequest");
const { preSignup, signup, signin, signupGuest, logout, modifyProfile, } = require("../controllers/usersController");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { addFriend } = require("../controllers/usersFriendsController");
const errorHandler = require("../middlewares/errorHandler");
const authenticateToken = require("../middlewares/authenticateToken");
const User = require("../models/users");

const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/pre-signup", userValidationRules(), validateRequest, preSignup);
router.post("/signup", userValidationRules(true), validateRequest, signup);
router.post("/signin", signInValidationRules(), validateRequest, signin);
router.post("/signup-guest", guestValidationRules(), validateRequest, signupGuest);
router.post('/logout', authenticateToken, logout);
router.put('/modify-profile', authenticateToken, modifyProfile)
router.post('/friends', authenticateToken, addFriend);

router.patch("/refresh", async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        console.log('refreshToken', refreshToken);

        if (!refreshToken) throw new CustomError("Refresh token is required", 401);

        const user = await User.findOne({ refresh_token: refreshToken });
        if (!user) throw new CustomError("Refresh token does not match any user", 401);

        const isRefreshTokenValid = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!isRefreshTokenValid) throw new CustomError("Refresh token is invalid", 401);

        const accessToken = generateAccessToken(user);

        res.status(200).json({ success: true, accessToken, refreshToken });
    } catch (error) {
        next(error);
    }

    next()
});

router.use(errorHandler);
// reminder, router.use(mymiddleware) is the same as app.use(middleware) 
// but it will applyied to all routes in this router and not over all the application's routers
// it's also the same as doing router.post("/route", mymiddleware, (req, res) => {})
// router.use(mymiddleware) will apply for all the routes after it
// so if you put it after the pre-signup route, it will apply for all the routes after it and not the pre-signup one

module.exports = router;
