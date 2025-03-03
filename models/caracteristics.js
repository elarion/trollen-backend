const mongoose = require('mongoose');

const caracteristicSchema = new mongoose.Schema({
    // Identifiant unique de la caractéristique
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },

    // Référence au personnage auquel ces caractéristiques appartiennent
    character: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'characters',
        required: true,
        index: true
    },

    // Statistiques principales du personnage
    strength: { type: Number, default: 1 }, // Force
    intelligence: { type: Number, default: 1 }, // Intelligence
    agility: { type: Number, default: 1 }, // Agilité

    // Ressources du personnage
    health: { type: Number, default: 100 }, // Points de vie
    mana: { type: Number, default: 50 }, // Points de mana

    // Progression du personnage
    level: { type: Number, default: 1 }, // Niveau
    xp: { type: Number, default: 0 }, // Points d'expérience
}, { timestamps: true });

const Caracteristic = mongoose.model('characteristics', caracteristicSchema);

module.exports = Caracteristic;