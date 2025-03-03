const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    // Identifiant unique du personnage
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },

    // Référence à l'utilisateur propriétaire du personnage
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true
    },

    // Pseudo du personnage, par défaut identique au `username` de l'utilisateur
    pseudo: {
        type: String,
        default: function () { return this.user_id.username; },
        index: true
    },

    // URL ou chemin vers l'image de l'avatar du personnage
    avatar: {
        type: String
    },

    // Genre du personnage (obligatoire)
    gender: {
        type: String,
        enum: ['female', 'male', 'non-binary'],
        required: true,
        default: 'non-binary',
    },

    // Référence à la race du personnage
    race: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'races',
        required: true,
        index: true
    },
}, { timestamps: true });

const Character = mongoose.model('characters', characterSchema);

module.exports = Character;