const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    // Unique ID for the participant
    // _id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     auto: true
    // },
    // User ID for the participant
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    // Role of the participant
    role: {
        type: String,
        enum: ['admin', 'moderator', 'troll'], // Rôles possibles
        required: true, // Obligatoire pour savoir quel pouvoir il a dans la room
        default: 'troll',
    },
    // Statut de l'utilisateur (connecté ou non)
    status: {
        type: String,
        enum: ['online', 'offline'], // Statuts possibles
        required: true,
        default: 'online',
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
}, { timestamps: true });

module.exports = participantSchema;