const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
    try {
        const token = socket.handshake.auth.token; // Récupère le token envoyé
        if (!token) throw new CustomError("No token provided", 400);

        // const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        socket.user = decoded; // Stocke l'utilisateur dans `socket.user`

        next(); // Passe au prochain middleware
    } catch (error) {
        next(error);
    }
};

module.exports = socketAuth;
