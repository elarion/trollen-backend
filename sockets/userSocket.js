const User = require("../models/users");

module.exports = (io, socket) => {
    console.log(`✅ Utilisateur connecté : ${socket.user.username} (socketId: ${socket.id})`);

    // Quand le user arrive sur le Lobby, on lui envoie la liste de ses rooms
    socket.on("getRoomsList", async () => {
        try {
            const user = await User.findById(socket.user._id).populate("rooms");
            if (!user) return;

            socket.emit("roomsList", { rooms: user.rooms });
        } catch (error) {
            console.error("Erreur lors de la récupération des rooms :", error);
        }
    });
};
