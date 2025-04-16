const mongoose = require('mongoose');

const messageRoomSchema = new mongoose.Schema({
    // Identifiant unique du message
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },

    // Utilisateur ayant envoyé le message
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },

    // Référence vers une Room (optionnel, si le message est envoyé dans une salle)
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms',
        required: true,
    },

    // Contenu du message
    content: {
        type: String,
        required: true, // Un message ne peut pas être vide
        trim: true, // Nettoyage des espaces inutiles
    },

    // Sort éventuellement lancé dans ce message (optionnel)
    spells: [{
        spell: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'spells',
            default: null
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            default: null
        }
    }],

    // Référence vers l'utilisateur ayant lancé un sort dans le message (optionnel)
    spelled_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: null
    },
}, { timestamps: true });

const MessageRoom = mongoose.model('messages_rooms', messageRoomSchema);

module.exports = MessageRoom;