const messageRoom = require('../models/messages_rooms');
const Spell = require('../models/spells');
const spells = require('../utils/spells');

const getAllByRoomId = async (room) => {
    try {
        const messages = await messageRoom
            .find({ room })
            .populate([{ path: 'user', select: '_id username' }, { path: 'spells', populate: { path: 'spell' } }])
            .sort({ createdAt: -1 });

        return messages;
    } catch (error) {
        throw error;
    }
}

const getByLimitAndRoomId = async (roomId, limit) => {
    try {
        const messages = await messageRoom
            .find({ room: roomId })
            .populate([{ path: 'user', select: '_id username' }, { path: 'spells', populate: { path: 'spell' } }])
            .sort({ createdAt: -1 })

        return messages;
    } catch (error) {
        throw error;
    }
}

const getByLastMessage = async (roomId, lastMessageId) => {
    try {
        // Find all the messages after the last message in the room
        const messages = await messageRoom.find({ room: roomId, _id: { $gt: lastMessageId } })
            .populate([{ path: 'user', select: '_id username' }, { path: 'spells', populate: { path: 'spell' } }])
            .sort({ createdAt: -1 })

        return messages;
    } catch (error) {
        throw error;
    }
}
const create = async (data) => {
    const { roomId, userId, content } = data;
    let { spells } = data;

    try {
        if (spells) {
            spells.map(spell => ({ spell: spell.spell._id }));
        }

        let newMessage = new messageRoom({
            room: roomId,
            user: userId,
            content,
            spells: spells || [],
        });

        await newMessage.save();

        newMessage = await newMessage.populate([{ path: 'user', select: '_id username' }, { path: 'spells', populate: { path: 'spell' } }]);

        return newMessage;
    } catch (error) {
        throw error;
    }
}

module.exports = { create, getAllByRoomId, getByLimitAndRoomId, getByLastMessage };