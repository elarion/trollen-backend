const { create, getAllByRoomId } = require('../services/messageRoomService');

const createMessageRoom = async (req, res, next) => {
    try {
        const message = await create({...req.body, room: req.params.roomId });

        return res.status(201).json({ success: true, message });
    } catch (error) {
        next(error);
    }
}

const getMessagesRoom = async (req, res, next) => {
    const { room } = req.params;

    try {
        const messages = await getAllByRoomId(room);

        return res.status(200).json({ success: true, messages });
    } catch (error) {
        next(error);
    }
}

module.exports = { createMessageRoom, getMessagesRoom };