const UserHasRoom = require('../models/users_has_rooms');

const createUserHasRoom = async function (doc, next) {
    const { _id, user } = doc;

    try {
        const newUserHasRoom = new UserHasRoom({
            room: _id,
            user: user,
            role: 'admin',
        });

        await newUserHasRoom.save();

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { createUserHasRoom };