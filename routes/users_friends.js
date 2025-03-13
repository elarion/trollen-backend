const express = require("express");
const authenticateToken = require("../middlewares/authenticateToken");
const { getSendedFriendRequests, getReceivedFriendRequests, acceptFriendRequest, getFriends, rejectFriendRequest, removeFriend } = require("../controllers/usersFriendsController");
const errorHandler = require("../middlewares/errorHandler");

const router = express.Router();

router.get('/sended/:userId', /* authenticateToken, */ getSendedFriendRequests)
router.get('/received/:userId',/*  authenticateToken,  */getReceivedFriendRequests);
router.post('/accept/:requestId', authenticateToken, acceptFriendRequest);
router.get('/friends/:userId',/*  authenticateToken,  */getFriends);
router.post('/reject/:requestId',/*  authenticateToken,  */rejectFriendRequest);
router.delete('/:userId/:friendId',/*  authenticateToken,  */ removeFriend);


router.use(errorHandler);
// reminder, router.use(mymiddleware) is the same as app.use(middleware) 
// but it will applyied to all routes in this router and not over all the application's routers
// it's also the same as doing router.post("/route", mymiddleware, (req, res) => {})
// router.use(mymiddleware) will apply for all the routes after it
// so if you put it after the pre-signup route, it will apply for all the routes after it and not the pre-signup one

module.exports = router;
