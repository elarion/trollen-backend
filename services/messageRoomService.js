const messageRoom = require('../models/messages_rooms');
const Room = require('../models/rooms');
const CustomError = require('../utils/CustomError');
const { isUserInRoom } = require('./userService');

const getAllByRoomId = async (room) => {
    try {
        const messages = await messageRoom
            .find({ room })
            .populate('user');

        return messages;
    } catch (error) {
        throw { statusCode: error.statusCode, message: error.message || 'Error while getting messages by roomId in messageRoomService' };
    }
}

const create = async (data) => {
    const { room, user, content, spelled = null, spelled_by = null } = data;

    try {
        const isRoomExists = await Room.findById(room).select('_id');
        if (!isRoomExists) throw new CustomError('Room not found', 404);

        const isUserExistsInRoom = await isUserInRoom(room, user);
        if (!isUserExistsInRoom) throw new CustomError('User not found in this room', 404);

        const newMessage = new messageRoom({
            room,
            user,
            content,
            spelled,
            spelled_by
        });

        await newMessage.save();

        return newMessage;
    } catch (error) {
        throw error;
    }
}

module.exports = { create, getAllByRoomId };