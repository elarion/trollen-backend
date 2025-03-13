const Room = require('../models/rooms');
const { isUserInRoom } = require('../services/userService');

const reconnectToRoom = async (io, socket, next) => {
    socket.on("reconnectToRoom", async ({ roomId, userId }, callback) => {
        try {
            // Vérifier si la room existe
            const isRoomExists = await Room.exists({ _id: roomId });
            if (!isRoomExists) {
                return callback({ success: false, message: "Room not found" });
            }

            // Vérifier si l'utilisateur est bien dans la room côté base de données
            const isUserExistsInRoom = await isUserInRoom(roomId, userId);
            if (!isUserExistsInRoom) {
                return callback({ success: false, message: "User not found in this room" });
            }

            // Vérifier si l'utilisateur est bien dans la room côté Socket.io
            const roomSockets = socket.adapter.rooms.get(roomId);
            const isUserInRoomSocket = roomSockets && roomSockets.has(socket.id);

            if (!isUserInRoomSocket) {
                socket.join(roomId);
                console.log(`✅ User ${userId} (socket ${socket.id}) reconnected to room ${roomId}`);
            }

            callback({ success: true, message: "User is in room" });
        } catch (error) {
            console.error("❌ Error in reconnectToRoom:", error);
            callback({
                success: false,
                message: error.message || "Internal server error",
                error: error
            });
        }
    });

    next(); // Passe au handler suivant (ex: sendMessage)
};

module.exports = reconnectToRoom;
