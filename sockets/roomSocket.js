const roomService = require("../services/roomService");
const User = require("../models/users");
const Room = require("../models/rooms");

module.exports = (io, socket) => {
    console.log(`🟢 Socket ${socket.id} connecté à RoomSockets`);

    // Garder une trace des utilisateurs en train de taper dans chaque room
    // Format: { roomId: { userId: { username, timestamp } } }
    if (!io.typingUsers) {
        io.typingUsers = {};
    }

    // Nettoyer régulièrement les utilisateurs qui ont arrêté de taper
    // (ceux qui n'ont pas envoyé de mise à jour depuis plus de 3 secondes)
    if (!io.cleanupTypingInterval) {
        io.cleanupTypingInterval = setInterval(() => {
            const now = Date.now();
            let updates = new Set(); // Pour suivre les rooms qui ont besoin d'une mise à jour

            for (const roomId in io.typingUsers) {
                for (const userId in io.typingUsers[roomId]) {
                    // Si la dernière mise à jour date de plus de 6 secondes, on supprime l'utilisateur
                    if (now - io.typingUsers[roomId][userId].timestamp > 6000) {
                        delete io.typingUsers[roomId][userId];
                        updates.add(roomId);

                        // Si plus personne ne tape dans cette room, on peut supprimer l'entrée
                        if (Object.keys(io.typingUsers[roomId]).length === 0) {
                            delete io.typingUsers[roomId];
                        }
                    }
                }
            }

            // Émettre des mises à jour uniquement pour les rooms qui ont changé
            updates.forEach(roomId => {
                if (io.typingUsers[roomId]) {
                    emitTypingUpdate(roomId);
                } else {
                    // Si la room n'existe plus dans typingUsers, envoyer une liste vide
                    io.to(roomId.toString()).emit("usersTyping", { typers: [] });
                }
            });
        }, 1000);

        // Nettoyer l'intervalle quand le serveur redémarre ou s'arrête
        process.on('SIGINT', () => {
            clearInterval(io.cleanupTypingInterval);
            process.exit(0);
        });
    }

    // Fonction pour émettre la mise à jour de qui est en train de taper
    const emitTypingUpdate = (roomId) => {
        if (!io.typingUsers[roomId]) {
            // Envoyer une liste vide si personne ne tape
            io.to(roomId.toString()).emit("usersTyping", { typers: [] });
            return;
        }

        const typers = Object.values(io.typingUsers[roomId]).map(user => ({
            _id: user.userId,
            username: user.username
        }));

        // Envoyer l'état actuel à tous les clients dans la room
        io.to(roomId.toString()).emit("usersTyping", { typers });
    };

    // Écouter l'événement "userTyping"
    socket.on("userTyping", ({ roomId, isTyping }) => {
        try {
            // Si l'utilisateur n'est pas authentifié, on ignore
            if (!socket.user) return;

            const userId = socket.user._id.toString();

            // S'assurer que la room existe dans notre map
            if (!io.typingUsers[roomId] && isTyping) {
                io.typingUsers[roomId] = {};
            }

            if (isTyping) {
                // Ajouter/mettre à jour l'utilisateur dans la liste
                io.typingUsers[roomId][userId] = {
                    userId: userId,
                    username: socket.user.username,
                    timestamp: Date.now()
                };
                emitTypingUpdate(roomId);
            } else if (io.typingUsers[roomId] && io.typingUsers[roomId][userId]) {
                // Supprimer l'utilisateur de la liste
                delete io.typingUsers[roomId][userId];

                // Si plus personne ne tape dans cette room, on peut supprimer l'entrée
                if (Object.keys(io.typingUsers[roomId]).length === 0) {
                    delete io.typingUsers[roomId];
                    io.to(roomId.toString()).emit("usersTyping", { typers: [] });
                } else {
                    emitTypingUpdate(roomId);
                }
            }
        } catch (error) {
            console.error("Erreur dans userTyping:", error);
        }
    });

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

    // Quitter une room - mettre à jour avec une gestion plus robuste
    socket.on("leaveRoom", ({ roomId, username }, callback) => {
        try {
            socket.leave(roomId);
            io.to(roomId.toString()).emit("userLeft", { username });
            console.log(`👋 ${username} a quitté la room ${roomId}`);

            // Supprimer l'utilisateur de la liste des typeurs avec une meilleure gestion des erreurs
            if (io.typingUsers && io.typingUsers[roomId] && socket.user) {
                const userId = socket.user._id.toString();
                if (io.typingUsers[roomId][userId]) {
                    delete io.typingUsers[roomId][userId];

                    // Si plus personne ne tape dans cette room, on peut supprimer l'entrée
                    if (Object.keys(io.typingUsers[roomId]).length === 0) {
                        delete io.typingUsers[roomId];
                        io.to(roomId.toString()).emit("usersTyping", { typers: [] });
                    } else {
                        emitTypingUpdate(roomId);
                    }
                }
            }

            if (callback) return callback({ success: true });
        } catch (error) {
            console.error("Erreur dans leaveRoom:", error);
            if (callback) return callback({
                success: false,
                message: error.message || "Une erreur est survenue",
                statusCode: 500,
            });
        }
    });

    // Nettoyage quand un socket se déconnecte - mettre à jour pour plus de robustesse
    socket.on("disconnect", () => {
        try {
            // Supprimer l'utilisateur de toutes les listes de typeurs
            if (socket.user && io.typingUsers) {
                const userId = socket.user._id.toString();
                const roomsToUpdate = new Set();

                // Parcourir toutes les rooms pour trouver où cet utilisateur tape
                for (const roomId in io.typingUsers) {
                    if (io.typingUsers[roomId][userId]) {
                        delete io.typingUsers[roomId][userId];
                        roomsToUpdate.add(roomId);

                        // Si plus personne ne tape dans cette room, on peut supprimer l'entrée
                        if (Object.keys(io.typingUsers[roomId]).length === 0) {
                            delete io.typingUsers[roomId];
                        }
                    }
                }

                // Émettre des mises à jour pour toutes les rooms affectées
                roomsToUpdate.forEach(roomId => {
                    if (io.typingUsers[roomId]) {
                        emitTypingUpdate(roomId);
                    } else {
                        io.to(roomId.toString()).emit("usersTyping", { typers: [] });
                    }
                });
            }
        } catch (error) {
            console.error("Erreur lors du nettoyage à la déconnexion:", error);
        }
    });
};
