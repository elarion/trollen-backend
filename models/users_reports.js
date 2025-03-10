const mongoose = require('mongoose');

const userReportSchema = mongoose.Schema({
    // Identifiant unique du signalement (géré automatiquement)
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },

    // Utilisateur qui fait le signalement
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Référence à la collection "users"
        required: true, // Obligatoire : un rapport a toujours un rapporteur
    },

    // Utilisateur signalé
    reported: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Référence à la collection "users"
        required: true, // Obligatoire : un rapport doit avoir une cible
    },

    // Raison du signalement
    reason: {
        type: String,
        enum: ['spam', 'toxic behavior', 'hate speech', 'scamming','griefing','doxxing','other'], // Raisons possibles
        required: true, // Obligatoire : un signalement doit avoir une raison
    },

    description: {
        type: String,
        default: null, // Facultatif : une description n'est pas obligatoire
    },

    // Statut du signalement (par défaut en attente de traitement)
    status: {
        type: String,
        enum: ['pending', 'rejected', 'accepted'], // États possibles
        required: true,
        default: 'pending', // Initialement "pending" en attente d'examen
    },
}, {
    timestamps: true // Ajoute automatiquement "createdAt" et "updatedAt"
});

const UserReport = mongoose.mongoose.model('users_reports', userReportSchema);

module.exports = UserReport;