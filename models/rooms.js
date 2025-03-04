const mongoose = require('mongoose');
const { createUserHasRoom } = require('../controllers/usersHasRoomsController');
const { createRoomSettingsFromRoom } = require('../controllers/roomSettingsController');
// const { createTagsFromRoomPreSave } = require('../controllers/tagsController');

const participantsSchema = new mongoose.Schema({
    // Unique ID for the participant
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
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

const roomSchema = new mongoose.Schema({
    // Identifiant unique de la salle
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },

    // Identifiant unique pour la gestion des WebSockets
    room_socket_id: {
        type: String,
        required: true, // Ce champ est obligatoire
        unique: true,  // Il doit être unique pour éviter les conflits
        index: true,   // Accélère les recherches basées sur cet ID
    },

    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },

    participants: [participantsSchema],

    room_settings: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'room_settings',
        default: null,
    },

    // Nom de la salle
    name: {
        type: String,
        required: true, // Un nom est nécessaire pour identifier la salle
        trim: true,     // Supprime les espaces inutiles en début et fin
        unique: true,
    },

    // Description de la salle (optionnel)
    description: {
        type: String,
        default: null, // Peut être null si aucune description n'est fournie
        trim: true,
    },

    // Liste des tags associés à la salle
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tags',  // Référence vers la collection `tags`
        index: true,  // Améliore les recherches sur les salles par tags
    }],
}, { timestamps: true });

// Index sur les tags pour optimiser les requêtes multi-tags
roomSchema.index({ tags: 1, name: 1 }, { unique: true });

// roomSchema.pre('save', createTagsFromRoomPreSave);
// roomSchema.post('save', createUserHasRoom);
roomSchema.post('save', createRoomSettingsFromRoom);

const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;
