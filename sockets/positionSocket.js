const usersPositions = {}; // Stocke les positions des utilisateurs

module.exports = (io, socket) => {
    console.log(`🟢 Socket ${socket.id} connecté à PositionSockets`);

    // Mettre à jour la position du joueur
    socket.on("updatePosition", ({ x, y, avatar }) => {
        // console.log(`🟢 Mise à jour de la position du joueur ${socket.user._id} à ${x}, ${y}`);
        usersPositions[socket.user._id] = { x, y, username: socket.user.username, avatar: avatar };
        // console.log(socket.user)
        // console.log('Users positions =>', usersPositions);
        // Broadcast à tous les autres joueurs
        socket.broadcast.emit("playersPositions", usersPositions);
    });

    // Envoyer toutes les positions au nouvel utilisateur qui rejoint
    socket.on("requestPlayers", () => {
        console.log('🟢 Requête des positions des joueurs');
        socket.emit("playersPositions", usersPositions);
    });

    // Supprimer la position quand un joueur quitte
    socket.on("disconnect", () => {
        console.log(`❌ Déconnexion : ${socket.id}`);
        delete usersPositions[socket.user._id];
        socket.broadcast.emit("playersPositions", usersPositions);
    });
};