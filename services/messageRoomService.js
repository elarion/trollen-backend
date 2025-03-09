const messageRoom = require('../models/messages_rooms');
const Room = require('../models/rooms');
const CustomError = require('../utils/CustomError');
const { isUserInRoom } = require('./userService');

const getAllByRoomId = async (room) => {
    try {
        const messages = await messageRoom
            .find({ room })
            .populate('user')
            .sort({ createdAt: -1 });

        return messages;
    } catch (error) {
        throw { statusCode: error.statusCode, message: error.message || 'Error while getting messages by roomId in messageRoomService' };
    }
}

const create = async (data) => {
    const { roomId, userId, content, spelled = null, spelled_by = null } = data;

    try {
        const isRoomExists = await Room.findById(roomId).select('_id');
        if (!isRoomExists) throw new CustomError('Room not found', 404);

        const isUserExistsInRoom = await isUserInRoom(roomId, userId);
        if (!isUserExistsInRoom) throw new CustomError('User not found in this room', 404);

        let newMessage = new messageRoom({
            room: roomId,
            user: userId,
            content,
            spelled,
            spelled_by
        });

        await newMessage.save();

        newMessage = await newMessage.populate('user');

        return newMessage;
    } catch (error) {
        throw error;
    }
}

module.exports = { create, getAllByRoomId };