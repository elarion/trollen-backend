const mongoose = require('mongoose');
const slugify = require('../utils/slugify');
// Définition du schéma Tag
const tagSchema = mongoose.Schema({
    // Identifiant unique du tag
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },

    // Slug du tag (format URL-friendly)
    slug: {
        type: String,
        required: true, // Ce champ est obligatoire
        unique: true,   // Assure qu'un même tag ne peut pas exister en double
        trim: true,     // Supprime les espaces inutiles
        lowercase: true, // Stocké en minuscule pour éviter les doublons
    },

    // Nom du tag (visible par l'utilisateur)
    name: {
        type: String,
        required: true, // Ce champ est obligatoire
        unique: true,   // Empêche les doublons de tags
        trim: true,     // Nettoyage des espaces inutiles
    },
}, { timestamps: true });

// ajouter un middleware pre pour le slugify des tags


const Tag = mongoose.model('tags', tagSchema);

module.exports = Tag;