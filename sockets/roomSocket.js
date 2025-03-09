const roomService = require("../services/roomService");

module.exports = (io, socket) => {
    console.log(`Socket ${socket.id} connecté à RoomSockets`);

    // Rejoindre une room
    socket.on("joinRoom", async ({ roomId, username }, callback) => {
        try {
            if (!roomId || !username) throw new CustomError("Room ID and username are required", 400);

            socket.join(roomId);

            console.log('backend =>', `${username} a rejoint la room ${roomId}`);

            // Envoyer l'état actuel de la room
            const room = await roomService.getById(roomId);

            io.to(roomId).emit("roomInfo", { room });

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
