const mongoose = require('mongoose');

// Définition du schéma users_has_parties
const userHasPartieSchema = mongoose.Schema({
    // Identifiant unique de l'entrée (géré automatiquement)
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },

    // Utilisateur qui a rejoint la party
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Référence à la collection "users"
        required: true, // Obligatoire : Un utilisateur doit être lié à une party
    },

    // Party rejointe par l'utilisateur
    party_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'parties', // Référence à la collection "parties"
        required: true, // Obligatoire : un utilisateur doit être lié à une party
    },

    // Rôle de l'utilisateur dans la party
    role: {
        type: String,
        enum: ['gamemaster', 'troll'], // Rôles possibles
        required: true, // Obligatoire pour définir la participation de l’utilisateur
    },

    // Statut de l'utilisateur dans la party
    status: {
        type: String,
        enum: ['online', 'disconnected', 'reconnecting', 'afk'], // Statuts possibles
        required: true,
        default: 'pending', // Par défaut, il est en attente d’initialisation
    },
}, {
    timestamps: true // Ajoute automatiquement "createdAt" et "updatedAt"
});

// Indexation pour optimiser la recherche par utilisateur et party
// On peut aussi faire ça la plutot que directement dans l'objet du Schema 
// pour éviter la redondance
userHasPartieSchema.index({ user_id: 1, party_id: 1 }, { unique: true });

const UserHasParty = mongoose.model('UserHasParty', userHasPartieSchema);

// Export du modèle UsersHasParties
module.exports = UserHasParty;