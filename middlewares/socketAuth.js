const User = require("../models/users");
const jwt = require("jsonwebtoken");

const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) throw new Error("No token provided");

        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        let user = await User.findById(decoded._id);

        if (!user) throw new CustomError("User not found", 404);

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
