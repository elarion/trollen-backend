const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    // Identifiant unique du message
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },

    // Utilisateur ayant envoyé le message
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true, // Optimisation pour les requêtes de recherche par utilisateur
    },

    // Référence vers une Room (optionnel, si le message est envoyé dans une salle)
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms',
        required: function () {
            return !this.party_id; // room_id est requis si party_id est NULL
        },
        index: true, // Améliore les performances des requêtes filtrant par room
    },

    // Référence vers une Party (optionnel, si le message est envoyé dans une partie)
    party_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'parties',
        required: function () {
            return !this.room_id; // party_id est requis si room_id est NULL
        },
        index: true, // Permet d'accélérer les requêtes dans les parties
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
        index: true, // Indexation pour accélérer les recherches sur les sorts utilisés
    },

    // Référence vers l'utilisateur ayant lancé un sort dans le message (optionnel)
    spelled_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
}, { timestamps: true });

// Index unique pour éviter d'avoir un message référencé à la fois dans `rooms` et `parties`
// Etant donné que room_id et party_id sont "optionnels" dans un cas ou dans un autre, on indique sparse : true 
// Pour les retiré de l'index pour l'un des champs qui sera null
messageSchema.index({ room_id: 1, party_id: 1 }, { sparse: true });

const Message = mongoose.model('messages', messageSchema);

module.exports = Message;