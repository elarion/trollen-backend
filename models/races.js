const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
    
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto : true,
    },

    name: {
        type: String,
        unique: true,
        required: true,
    },

    tagline: {
        type: String,
        default: "", //VERIFIER SI IL APPARAIT
    },

    description: {
        type: String,
        required: true,
    },

    avatar: {
        type: String,
        required: true,
    },

    spells: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'spells',
        required: true,
    }],

}, {
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
});

raceSchema.index({spell: 1}, {unique : true})

const Race = mongoose.model('races', raceSchema);

module.exports = Race;