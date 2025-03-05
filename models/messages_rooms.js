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
    spelled: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'spells',
        default: null
    },

    // Référence vers l'utilisateur ayant lancé un sort dans le message (optionnel)
    spelled_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: null
    },
}, { timestamps: true });

// Index unique pour éviter d'avoir un message référencé à la fois dans `rooms` et `parties`
// Etant donné que room_id et party_id sont "optionnels" dans un cas ou dans un autre, on indique sparse : true 
// Pour les retiré de l'index pour l'un des champs qui sera null
messageRoomSchema.index({ room: 1, party: 1 }, { sparse: true });

const MessageRoom = mongoose.model('messages_rooms', messageRoomSchema);

module.exports = MessageRoom;