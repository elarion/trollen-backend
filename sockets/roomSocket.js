const roomService = require("../services/roomService");

module.exports = (io, socket) => {
    console.log(`Socket ${socket.id} connecté à RoomSockets`);

    // Rejoindre une room
    socket.on("joinRoom", async ({ roomId, username }, callback) => {
        try {
            if (!roomId || !username) throw new CustomError("Room ID and username are required", 400);

            const roomKey = String(roomId);
            socket.join(roomKey);

            console.log('backend =>', `${username} a rejoint la room ${roomId}`);

            // Envoyer l'état actuel de la room
            const room = await roomService.getById(roomId);

            io.to(roomKey).emit("roomInfo", { room });

            callback({ success: true });
        } catch (error) {
            callback({
                success: false,
                error: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        }
    });

    socket.on('spelled', ({ targetId, roomId }, callback) => {
        try {
            const roomKey = String(roomId);
            const clientsInRoom = io.sockets.adapter.rooms.get(roomKey);
            if (!clientsInRoom) throw new CustomError("Room not found", 404);

            console.log('clientsInRoom =>', clientsInRoom);

            for (const socketId of clientsInRoom) {
                const socket = io.sockets.sockets.get(socketId);
                if (socket && socket.user && socket.user._id === targetId) {
                    console.log(`🔮 Sort lancé sur ${socket.user.username} (socket.id: ${socket.id})`);
                    io.to(socket.id).emit("spelledInRoom", { targetId, roomId });
                }
            }
            // io.to(roomId).emit('spelledInRoom', { targetId, roomId });

            callback({ success: true });
        } catch (error) {
            callback({
                success: false,
                error: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        }
    });

    // Quitter une room
    socket.on("leaveRoom", ({ roomId, username }, callback) => {
        try {
            socket.leave(roomId);
            console.log('backend =>', `${username} a quitté la room ${roomId}`);
            return callback({ success: true });
        } catch (error) {
            return callback({
                success: false,
                message: error.message || "Une erreur est survenue",
                statusCode: 500,
            });
        }
    });

    // Supprime l'ancien `socket.io("roomInfo", ...)` qui était incorrect.
};
