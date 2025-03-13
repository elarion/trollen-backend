const roomService = require("../services/roomService");
const User = require("../models/users");
const Room = require("../models/rooms");

module.exports = (io, socket) => {
    console.log(`Socket ${socket.id} connecté à RoomSockets`);

    socket.on("joinRoom", async ({ roomId }, callback) => {
        try {
            const user = await User.findById(socket.user._id);
            if (!user) throw new CustomError("User not found", 404);

            const room = await Room.findById(roomId).populate('participants.user');
            if (!room) throw new CustomError("Room not found", 404);

            // Vérifier si le user est déjà dans la room côté WebSocket
            if (socket.rooms.has(roomId.toString())) {
                console.log(`${user.username} est déjà dans la room ${roomId}, id socket => ${socket.id}`);
                const roomUpdated = await roomService.getById(roomId);
                io.to(roomId.toString()).emit("roomInfo", { room: roomUpdated });
                return callback({ success: true, message: "Déjà dans la room" });
            }

            // Ajouter le user à la room en base de données s'il n'est pas encore dedans
            if (!room.participants.some(participant => participant.user?._id.equals(user._id))) {
                room.participants.push({ user: user._id, role: 'troll' });
                await room.save();
            }

            // Ajouter la room au sous-document du user s'il n'y est pas encore
            if (!user.rooms.some((r) => r.room.toString() === roomId)) {
                user.rooms.push({ room: roomId });
                await user.save();
            }

            // Maintenant, on peut rejoindre la room
            socket.join(roomId.toString());

            console.log(`🏠 ${user.username} a rejoint la room ${roomId}`);

            // Informer les autres utilisateurs de la room
            io.to(roomId.toString()).emit("userJoined", { username: user.username });

            const roomUpdated = await roomService.getById(roomId);
            io.to(roomId.toString()).emit("roomInfo", { room: roomUpdated });

            callback({ success: true });
        } catch (error) {
            callback({
                success: false,
                message: error.message || "Internal Server Error",
                error: error,
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
                message: error.message || "Internal Server Error",
                error: error,
                statusCode: error.statusCode || 500
            });
        }
    });


    // Quitter une room
    socket.on("leaveRoom", ({ roomId, username }, callback) => {
        try {
            socket.leave(roomId);
            io.to(roomId.toString()).emit("userLeft", { username });
            console.log(`👋 ${username} a quitté la room ${roomId}`);
            if (callback) return callback({ success: true });
        } catch (error) {
            if (callback) return callback({
                success: false,
                message: error.message || "Une erreur est survenue",
                statusCode: 500,
            });
        }
    });

    // Supprime l'ancien `socket.io("roomInfo", ...)` qui était incorrect.
};
