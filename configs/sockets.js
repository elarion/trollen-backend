const socketIo = require("socket.io");
const socketHandlers = require("../sockets"); // récupère le index.js directement
const socketAuth = require('../middlewares/socketAuth');
// const socketErrorHandler = require('../middlewares/socketErrorHandler');
const User = require("../models/users");

module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: function (origin, callback) {
                const allowedOrigins = [process.env.FRONTEND_URL];
                if (allowedOrigins.includes(origin) || !origin) {
                    callback(null, true);
                } else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
            methods: ["GET", "POST", "PUT", "DELETE"],
        },
        pingTimeout: 60000, // Ferme la connexion après 60 secondes sans réponse
        pingInterval: 25000, // Ping du serveur toutes les 25 secondes
    });

    // On passe io en paramètre pour pouvoir l'utiliser dans les routes
    const app = require("../app");
    app.set("io", io);

    // middleware pour vérifier si le client est authentifié
    io.use(socketAuth);

    io.on("connection", (socket) => {
        console.log("Client connecté", socket.id);

        // Charge tous les sockets depuis `sockets/index.js`
        socketHandlers(io, socket);

        // Gestion des erreurs
        // socket.use(socketErrorHandler);

        // Gestion du ping du serveur
        socket.on("pingServer", () => {
            socket.emit("pongClient");
        });

        // Gestion de la déconnexion
        socket.on("disconnect", async () => {
            console.log(`❌ Déconnexion : ${socket.id}`);

            await User.updateOne({ socket_id: socket.id }, { $set: { socket_id: null } });

            // Vérifier s'il reste d'autres sockets actifs pour le user
            const stillConnectedUsers = await User.find({ socket_id: { $ne: null } }).select("socket_id");
            if (stillConnectedUsers.length === 0) {
                io.emit("userDisconnected", { socketId: socket.id });
            }
        });
    });

    return io;
};
