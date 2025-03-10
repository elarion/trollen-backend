const userFriendService = require('../services/userFriendService')

const addFriend = async (req, res, next) => {
    try {
        const user_1 = req.user._id;
        const user_2 = req.body.targetUserId;
        
        const userFriend = await userFriendService.add({user_1, user_2})

        res.status(200).json({ success: true, message: "friend ajouté", userFriend });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addFriend,
};