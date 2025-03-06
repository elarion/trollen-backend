 // Classe d'erreur personnalisée pour gérer les erreurs dans l'application
class CustomError extends Error {
    // Constructeur de la classe avec un message et un code d'état
    constructor(message, statusCode) {
        // super() est une référence à la classe mère
        // donc super() c'est comme appeler le constructeur de la classe mère Error
        super(message);
        // this fais référence à l'objet actuel qui par extension est une instance de Error
        // Définit le statut de l'erreur
        this.statusCode = statusCode;
        // Capture la pile d'appels pour obtenir des informations sur l'erreur
        Error.captureStackTrace(this, this.constructor);
    }
}

// Ajouter CustomError à l'objet global de Node.js pour pouvoir l'utiliser dans toute l'application
global.CustomError = CustomError;

module.exports = CustomError;