const mongoose = require('mongoose');

// Définition du schéma users_has_rooms
const userHasRoomSchema = mongoose.Schema({
    // Identifiant unique de l'entrée (géré automatiquement)
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },

    // Utilisateur qui a rejoint la room
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Référence à la collection "users"
        required: true, // Un enregistrement doit forcément être lié à un utilisateur
    },

    // Room rejointe par l'utilisateur
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms', // Référence à la collection "rooms"
        required: true, // Obligatoire : un utilisateur doit être lié à une room
    },

    // Rôle de l'utilisateur dans la room
    role: {
        type: String,
        enum: ['admin', 'moderator', 'troll'], // Rôles possibles
        required: true, // Obligatoire pour savoir quel pouvoir il a dans la room
    },

    // Statut de l'utilisateur (connecté ou non)
    status: {
        type: String,
        enum: ['online', 'offline'], // Statuts possibles
        required: true,
        default: 'pending', // Par défaut, il est en attente d'initialisation
    },

    // Dernière activité de l'utilisateur dans la room
    last_seen_at: {
        type: Date, // Stocke la dernière date où il était actif dans la room
        default: null, // Peut être null si jamais connecté
    },

    // Dernier message lu par l'utilisateur
    last_message_read: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages', // Référence à la collection "messages"
        default: null, // Null si l’utilisateur n'a encore rien lu
    },
}, {
    timestamps: true // Ajoute automatiquement "createdAt" et "updatedAt"
});

const UserHasRoom = mongoose.model('users_has_rooms', userHasRoomSchema);

module.exports = UserHasRoom;