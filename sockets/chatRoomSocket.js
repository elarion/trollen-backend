const MessageRoom = require("../models/messages_rooms");
const roomService = require('../services/roomService');
const messageRoomService = require('../services/messageRoomService');
const { coupedecale } = require("../utils/spells");

module.exports = (io, socket) => {
    console.log(`Socket ${socket.id} connecté à ChatSockets`);

    // Envoyer un message dans une room
    socket.on("sendMessage", async ({ roomId, content, username, spelled }, callback) => {
        if (!roomId || !content || !username) return;


        if (spelled) {
            content = coupedecale(content);
        }

        console.log("id user in socket =>", socket.user._id);

        // Sauvegarde du message dans la base de données
        const message = await messageRoomService.create({ roomId, content, userId: socket.user._id });

        io.to(roomId).emit("roomMessage", { message });

        callback({ success: true, message: 'Message bien envoyé (depuis le backend)' });
    });

    // Charger l'historique des messages d'une room
    socket.on("loadMessages", async ({ roomId }, callback) => {
        const messages = await messageRoomService.getAllByRoomId(roomId);

        if (typeof callback === "function") {
            callback(messages);
        }
    });
};