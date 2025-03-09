const CustomError = require("../utils/CustomError");

// Gestion des erreurs
const socketErrorHandler = (socket, next) => {
    // On retourne une fonction qui gère les erreurs
    // Le paramètre err est l'erreur qui a été levée
    // Le paramètre callback est la fonction qui a été passée à la fonction socketHandlers
    // voir dans configs/sockets.js
    return (err, callback) => {
        console.log("Socket.IO Error Handler =>", err);

        if (!(err instanceof Error)) {
            err = new CustomError(err.message || "Internal Server Error", err.statusCode || 500, err.errors || []);
        }

        console.error("Stack trace =>", err.stack);

        const errorResponse = {
            success: false,
            message: err.message || "Internal Server Error",
            statusCode: err.statusCode || 500,
            errors: err.errors || [],
        };

        // Si callback est défini, on renvoie l'erreur via le callback
        if (typeof callback === "function") return callback(errorResponse);

        // Sinon, on émet l'erreur au client globalement
        socket.emit("error", errorResponse);

        next(); // Continue l'exécution sans crasher le serveur
    };
};

module.exports = socketErrorHandler;
