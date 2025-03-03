const mongoose = require('mongoose');

const userHasTrophySchema = mongoose.Schema({
    // Identifiant unique du document (géré automatiquement par MongoDB)
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },

    // Référence vers l'utilisateur ayant obtenu le trophée
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Référence à la collection "users"
        required: true, // L'utilisateur est obligatoire
        index: true, // Optimisation des requêtes
    },

    // Référence vers le trophée remporté
    trophy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trophies', // Référence à la collection "trophies"
        required: true, // Un trophée est obligatoire
        index: true, // Optimisation des requêtes
    },

    // Référence vers le niveau de trophée atteint (si applicable)
    level_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trophy_levels', // Référence à la collection "trophy_levels"
        index: true, // Optimisation pour la récupération rapide des niveaux atteints
    },

    // Progression actuelle de l'utilisateur vers le prochain palier du trophée
    progress: {
        type: Number,
        default: 0, // Par défaut, la progression commence à zéro
        min: 0, // Empêche les valeurs négatives
    },

    // Date à laquelle l'utilisateur a atteint le trophée (si déjà obtenu)
    achieved_at: {
        type: Date,
        default: null, // Optionnel, ne s'ajoute que si le trophée est atteint
    },
}, {
    timestamps: true // Ajoute automatiquement "createdAt" et "updatedAt"
});

const UserHasTrophy = mongoose.model('users_has_trophies', userHasTrophySchema);

module.exports = UserHasTrophy;