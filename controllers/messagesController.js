const Room = require('../models/rooms');
const messageRoomService = require('../services/messageRoomService');
const { isUserInRoom } = require('../services/userService');

const getAllMessagesByRoomId = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const messages = await messageRoomService.getAllByRoomId(roomId);

        return res.status(200).json({ success: true, messages });
    } catch (error) {
        next(error);
    }
};

const getMessagesByLimitAndRoomId = async (req, res, next) => {
    try {
        const { roomId, limit } = req.params;

        const messages = await messageRoomService.getByLimitAndRoomId(roomId, limit);

        return res.status(200).json({ success: true, messages });
    } catch (error) {
        next(error);
    }
};

const getMessagesByLastMessage = async (req, res, next) => {
    try {
        const { roomId, lastMessageId } = req.params;

        const messages = await messageRoomService.getByLastMessage(roomId, lastMessageId);

        return res.status(200).json({ success: true, messages });
    } catch (error) {
        next(error);
    }
};

const createMessage = async (req, res, next) => {
    const { content, spell = false } = req.body;
    const { roomId } = req.params;
    const user = req.user;

    console.log('content =>', content);

    try {
        const isRoomExists = await Room.exists({ _id: roomId });
        if (!isRoomExists) throw new CustomError('Room not found', 404);

        const isUserExistsInRoom = await isUserInRoom(roomId, user._id);
        if (!isUserExistsInRoom) throw new CustomError('User not found in this room', 404);

        // Vérifier si l'utilisateur est bien dans la room côté Socket.io
        const roomSockets = req.io.sockets.adapter.rooms.get(roomId);
        const isUserInRoomSocket = roomSockets && roomSockets.has(user.socket_id);

        if (!isUserInRoomSocket) {
            const socket = req.io.sockets.sockets.get(user.socket_id);
            if (socket) {
                socket.join(roomId);
                console.log(`✅ User ${user.username} added to room ${roomId} via socket`);
            } else {
                console.log(`❌ Impossible to add user ${user.username} to room ${roomId} (socket not found)`);
                throw new CustomError('User can not join room because socket not found', 404);
            }
        }

        const message = await messageRoomService.create({ content, roomId, userId: user._id, spell });

        req.io.to(roomId).emit("roomMessage", { message });

        return res.status(201).json({ success: true });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllMessagesByRoomId,
    getMessagesByLimitAndRoomId,
    createMessage,
    getMessagesByLastMessage,
};
