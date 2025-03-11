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

const getSendedFriendRequests = async (req, res, next) => {
    try {
        const { userId: user_1 } = req.params;
        const sended = await userFriendService.getSend(user_1);

        if (sended && sended.length > 0) {
            res.status(200).json({ success: true, message: "demande envoyé", sended });
        } else {
            res.status(404).json({ success: false, message: "Aucune demande d'ami trouvé" });
        }
    } catch (error) {
        next(error);
    }
};

const getReceivedFriendRequests = async (req, res, next) => {
    try {
        const { userId: user_1 } = req.params;
        const received = await userFriendService.getReceived(user_1);

        if (received && received.length > 0) {
            res.status(200).json({ success: true, message: "Received friend requests ok", received });
        } else {
            res.status(404).json({ success: false, message: "Aucune demande d'ami reçue" });
        }
    } catch (error) {
        next(error);
    }
};
// {
//     "_id": {
//       "$oid": "67d007260fa128f45df56414"
//     },
//     "user_1": {
//       "$oid": "67cf436c29930a85363f8ac3"
//     },
//     "user_2": {
//       "$oid": "67cb09e80405e17291e1d5f2"
//     },
//     "status": "accepted",
//     "createdAt": {
//       "$date": "2025-03-11T09:49:26.257Z"
//     },
//     "updatedAt": {
//       "$date": "2025-03-11T09:51:45.012Z"
//     },
//     "__v": 0
//   },
// {
//     "_id": {
//       "$oid": "67d0074f0fa128f45df5644c"
//     },
//     "user_1": {
//       "$oid": "67cff3468b989b4996fa7569"
//     },
//     "user_2": {
//       "$oid": "67cb09e80405e17291e1d5f2"
//     },
//     "status": "pending",
//     "createdAt": {
//       "$date": "2025-03-11T09:50:07.377Z"
//     },
//     "updatedAt": {
//       "$date": "2025-03-11T09:50:07.377Z"
//     },
//     "__v": 0
//   }

const acceptFriendRequest = async (req, res, next) => {
    try {
        const { requestId } = req.params;

        // Appeler le service pour accepter la demande d'ami
        await userFriendService.acceptFriend(requestId);

        const friends = await userFriendService.friends(req.user._id);

        res.status(200).json({ success: true, message: 'Friend request accepted', friends });
    } catch (error) {
        next(error);
    }
};

const getFriends = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const friends = await userFriendService.friends(userId);
        res.status(200).json({ success: true, friends });
    } catch (error) {
        next(error);
    }
};

const rejectFriendRequest = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const result = await userFriendService.rejectFriend(requestId);
        res.status(200).json({ 
            success: true, 
            message: 'Invitation rejetée avec succès',
            rejectedRequest: result 
        });
    } catch (error) {
        next(error);
    }
};

const removeFriend = async (req, res, next) => {
    try {
        const { userId, friendId } = req.params;
        await userFriendService.remove(userId, friendId);
        res.status(200).json({ 
            success: true, 
            message: 'Ami supprimé avec succès' 
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    addFriend,
    getSendedFriendRequests,
    getReceivedFriendRequests,
    acceptFriendRequest,
    getFriends,
    rejectFriendRequest,
    removeFriend
};