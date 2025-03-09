const socketIo = require("socket.io");
const socketHandlers = require("../sockets"); // récupère le index.js directement
const socketAuth = require('../middlewares/socketAuth');
const socketErrorHandler = require('../middlewares/socketErrorHandler');

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
    });

    // middleware pour vérifier si le client est authentifié
    io.use(socketAuth);

    io.on("connection", (socket) => {
        console.log("Client connecté", socket.id);

        // Charge tous les sockets depuis `sockets/index.js`
        socketHandlers(io, socket);

        // Gestion des erreurs
        // socket.use(socketErrorHandler);

        // Gestion de la déconnexion
        socket.on("disconnect", () => {
            console.log("Client déconnecté", socket.id);
        });
    });

    return io;
};
