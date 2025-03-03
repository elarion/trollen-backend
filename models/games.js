const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto : true,
    },

    name: {
        type: String,
        unique: true,
        required: true
    },

    description: {
        type: String,
        required: true,
    },

    min: {
        type: Number,
        required: true,
    },

    max: {
        type: Number,
        required: true,
    },

    duration: {
        type: Number,
        required: true,
    },

    turn_time_limit: {
        type: Number,
        required: true,
        default: 30
    },

    use_spells: {
        type: Boolean,
        default: true,
    },

}, {
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
});

const Game = mongoose.model('games', gameSchema);

module.exports = Game;