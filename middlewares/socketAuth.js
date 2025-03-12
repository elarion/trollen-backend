const User = require("../models/users");
const jwt = require("jsonwebtoken");

const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) throw new Error("No token provided");

        console.log('in scoket auth token =>', token);
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        let user = await User.findById(decoded._id);

        if (!user) throw new CustomError("User not found", 404);

        console.log(`Bienvenue dans le socket mon ami => ${user.username}`);

        if (user?.socket_id && user.socket_id !== socket.id) {
            console.log(`Ancien socket détecté : ${user.socket_id}`);

            // Forcer la déconnexion de l'ancien socket
            const oldSocket = socket.server.sockets.sockets.get(user.socket_id);
            if (oldSocket) {
                oldSocket.disconnect(true);
                console.log(`❌ Ancien socket ${user.socket_id} déconnecté`);
            }
        }

        // Mettre à jour socketId
        user.socket_id = socket.id;
        await user.save();

        // Associer l'utilisateur au socket
        socket.user = user;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = socketAuth;
