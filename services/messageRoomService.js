const messageRoom = require('../models/messages_rooms');
const Room = require('../models/rooms');
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
        console.log(data);
        const isRoomExists = await Room.findById(room).select('_id');
        const isUserExistInRoom = await isUserInRoom(room, user);
        console.log(isUserExistInRoom);
        if (!isRoomExists) throw { statusCode: 404, message: 'Room not found' };

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
        throw { statusCode: error.statusCode, message: error.message || 'Error while creating message in messageRoomService' };
    }
}

module.exports = { create, getAllByRoomId };