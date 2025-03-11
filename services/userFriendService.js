const UserFriend = require('../models/users_friends')

const add = async ({user_1, user_2}) => {
    const friend = await UserFriend.findOne({$or : [{user_1 , user_2}, {user_1 : user_2, user_2 : user_1}]});
    // Checker en BDD si y'a pas déjà cette amitié, or 
    // UserFriend.findOne({$or : [{user_1 , user_2}, {user_1 : user_2, user_2 : user_1}])
    // On peut enregister la friendship
    const newFriend = new UserFriend({
        user_1,
        user_2
    })
    await newFriend.save();
}

const getSend = async (user_1) => {
    try {
        const friends = await UserFriend.find({ user_1 }).populate('user_2', 'username');
        return friends.map(
            sended => ({
            user_1: sended.user_1,
            friend : sended.user_2,
            status: sended.status,
    }));
    } catch (error) {
        throw new Error('Erreur lors de la récupération des amis');
    }
};

const getReceived = async (user_1) => {
    try {
        // Rechercher les demandes où user_1 est le destinataire
        const friends = await UserFriend.find({ user_2: user_1, status: 'pending' }).populate('user_1', 'username');
        return friends.map(received => ({
            _id: received._id,
            user_2: received.user_1, // user_1 est celui qui a envoyé la demande
            status: received.status,
        }));
    } catch (error) {
        throw new Error("Erreur lors de la récupération des demandes d'amis");
    }
};

const acceptFriend = async (requestId) => {
    try {
        console.log('requestId reçu :', requestId);
        const existingRequest = await UserFriend.findById(requestId);
        if (!existingRequest) {
            throw new Error('Friend request not found');
        }

        const updatedRequest = await UserFriend.findByIdAndUpdate(
            requestId,
            { status: 'accepted' },
            { new: true }
        );

        if (!updatedRequest) {
            throw new Error('Friend request not found after update');
        }

        

        return updatedRequest;
    } catch (error) {
        console.error('Erreur dans acceptFriend :', error.message);
        throw new Error('Error updating friend request status');
    }
};

const friends = async (userId) => {
    try {
        const friends = await UserFriend.find({
            $or: [
                { user_1: userId, status: 'accepted' },
                { user_2: userId, status: 'accepted' }
            ]
        }).populate('user_1 user_2', 'username');

        return friends.map(friend => {
            const friendData = friend.user_1._id.toString() === userId ? friend.user_2 : friend.user_1;
            return {
                _id: friendData._id,
                username: friendData.username,
                relationshipId: friend._id
            };
        });
    } catch (error) {
        throw new Error("Erreur lors de la récupération de la liste d'amis");
    }
}

const rejectFriend = async (requestId) => {
    try {
        const rejectedRequest = await UserFriend.findByIdAndUpdate(
            requestId,
            { status: 'rejected' },
            { new: true }
        );

        if (!rejectedRequest) {
            throw new Error("Demande d'ami non trouvée");
        }

        return rejectedRequest;
    } catch (error) {
        console.error("Erreur lors du rejet de l'invitation :", error);
        throw new Error("Erreur lors du rejet de l'invitation");
    }
};

const remove = async (userId, friendId) => {
    try {

        const deletedFriendship = await UserFriend.findOneAndDelete({
            $or: [
                { user_1: userId, user_2: friendId, status: 'accepted' },
                { user_1: friendId, user_2: userId, status: 'accepted' }
            ]
        });

        if (!deletedFriendship) {
            throw new Error("Relation d'amitié non trouvée");
        }

        return true;
    } catch (error) {
        console.error("Erreur lors de la suppression de l'ami :", error);
        throw new Error("Erreur lors de la suppression de l'ami");
    }
};

module.exports = {
    add,
    getSend,
    getReceived,
    acceptFriend,
    friends,
    rejectFriend,
    remove
}