const messageRoomService = require('../services/messageRoomService');
const Room = require('../models/rooms');
const User = require('../models/users');
const { isUserInRoom } = require('../services/userService');
const spells = require('../utils/spells');
const launchSpells = {};
const reconnectToRoom = require('../middlewares/socketReconnectRoom');
const slugify = require('../utils/slugify');

module.exports = (io, socket) => {
    console.log(`🟢 Socket ${socket.id} connecté à ChatRoomSockets`);

    // Envoyer un message dans une room
    reconnectToRoom(io, socket, () => {
        socket.on("sendMessage", async ({ roomId, content, username }, callback) => {
            try {
                if (!roomId || !content || !username) {
                    return callback({ success: false, message: "Données manquantes" });
                }

                // Vérifier si la room existe en base de données
                const isRoomExists = await Room.exists({ _id: roomId });
                if (!isRoomExists) {
                    return callback({ success: false, message: "Room not found" });
                }

                // Vérifier si l'utilisateur est bien dans la room en base de données
                const isUserExistsInRoom = await isUserInRoom(roomId, socket.user._id);
                if (!isUserExistsInRoom) {
                    return callback({ success: false, message: "The user is not in this room" });
                }

                // Vérifier si l'utilisateur est bien dans la room côté Socket.io
                // const roomSockets = io.sockets.adapter.rooms.get(roomId);
                // const isUserInRoomSocket = roomSockets && roomSockets.has(socket.id);


                // if (!isUserInRoomSocket) {
                //     socket.join(roomId);
                //     console.log(`✅ User ${username} reconnected to room ${roomId} via socket`);
                // }

                let spellsSuccess = [];
                if (launchSpells[socket.user._id]) {
                    for (const spell of launchSpells[socket.user._id]) {
                        console.log('spell =>', slugify(spell.spell.name, true));
                        if (spells[slugify(spell.spell.name, true)]) {
                            spellsSuccess.push(spell);
                            content = spells[slugify(spell.spell.name, true)](content);
                        }
                    }

                    delete launchSpells[socket.user._id];
                }

                // Sauvegarde du message dans la base de données
                const message = await messageRoomService.create({
                    roomId,
                    userId: socket.user._id,
                    content,
                    spells: spellsSuccess
                });

                // Envoyer le message à tous les membres de la room sauf moi
                // socket.broadcast.to(roomId).emit("roomMessage", { message });
                io.to(roomId).emit("roomMessage", { message });

                callback({ success: true, message: "Message bien envoyé (depuis le backend)" });
            } catch (error) {
                console.error("❌ Erreur dans sendMessage:", error);
                callback({ success: false, message: "Erreur interne du serveur" });
            }
        });
    });

    socket.on("reconnectToRoom", async ({ roomId, userId }, callback) => {
        // Vérifier si l'utilisateur est bien dans la room côté Socket.io
        const roomSockets = io.sockets.adapter.rooms.get(roomId);
        const isUserInRoomSocket = roomSockets && roomSockets.has(socket.id);

        if (!isUserInRoomSocket) {
            socket.join(roomId);
            console.log(`✅ User socket ${socket.id} reconnected to room ${roomId}`);
        }

        callback({ success: true, message: "User is in room" });
    });

    // Charger l'historique des messages d'une room
    socket.on("loadMessages", async ({ roomId }, callback) => {
        const messages = await messageRoomService.getAllByRoomId(roomId);

        console.log(messages);

        if (typeof callback === "function") {
            callback(messages);
        }
    });

    socket.on("launchSpell", async ({ roomId, targetId, spell }, callback) => {
        try {
            if (!launchSpells[targetId]) launchSpells[targetId] = [];

            const target = await User.findById(targetId).select('username socket_id');
            if (!target || !target?.socket_id) throw new CustomError("Target not found", 404);

            // const roomSockets = io.sockets.adapter.rooms.get(roomId);
            // const isUserInRoomSocket = roomSockets && roomSockets.has(target.socket_id);
            // if (!isUserInRoomSocket) throw new CustomError("Target not in room", 404);
            const isUserExistsInRoom = await isUserInRoom(roomId, targetId);
            if (!isUserExistsInRoom) {
                return callback({ success: false, message: "The user is not in this room" });
            }

            launchSpells[targetId].push(spell);

            // io.to(target.socket_id).emit("spelledInRoom", { targetId, roomId });
            // io.to(roomId).emit("roomSpellToAll", { message: `Le sort ${spell} a été lancé par ${socket.user.username} sur ${target.username}` });

            console.log(`Spell ${spell.spell.name} launched by user ${socket.user.username} to ${target.username} in room ${roomId}`);

            callback({ success: true });

        } catch (error) {
            callback({
                success: false,
                error: error.message || "Internal Server Error",
                statusCode: error.statusCode || 500
            });
        }
    });
};