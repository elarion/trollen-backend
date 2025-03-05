const Room = require('../models/rooms');

const isUserInRoom = async (roomId, userId) => {
    try {
        // Find a room by its users in the subdoc participants of the Room model
        const room = await Room.findOne({ _id: roomId, participants: { user: userId } });
        return room ? true : false;
    } catch (error) {
        throw { statusCode: error.statusCode, message: error.message || 'Error while checking if user is in room in userService' };
    }
}

module.exports = { isUserInRoom };