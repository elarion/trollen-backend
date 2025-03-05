const RoomMessage = require('../models/rooms_messages');

const create = async (data) => {
    const { room, user, party, content, spelled, spelled_by } = data;

    try {
        const newMessage = new RoomMessage({
            room,
            user,
            party,
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

module.exports = { create };