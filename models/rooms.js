const mongoose = require('mongoose');

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

    // Nom de la salle
    name: {
        type: String,
        required: true, // Un nom est nécessaire pour identifier la salle
        trim: true,     // Supprime les espaces inutiles en début et fin
    },

    // Description de la salle (optionnel)
    description: {
        type: String,
        default: null, // Peut être null si aucune description n'est fournie
        trim: true,
    },

    // Liste des tags associés à la salle
    tags_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tags',  // Référence vers la collection `tags`
        index: true,  // Améliore les recherches sur les salles par tags
    }],
}, { timestamps: true });

// Index sur les tags pour optimiser les requêtes multi-tags
roomSchema.index({ tags_id: 1 });

const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;
