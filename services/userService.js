const Room = require('../models/rooms');

const isUserInRoom = async (roomId, userId) => {
    try {
        console.log('isUserinRoom =>', roomId, userId)
        // Find a room by its users in the subdoc participants of the Room model
        const room = await Room.findOne({ _id: roomId, participants: { $elemMatch: { user: userId } } }).select('_id');
        return room ? true : false;
    } catch (error) {
        throw error
    }
}

module.exports = { isUserInRoom };