const mongoose = require('mongoose');

const characterSpellSchema = new mongoose.Schema({

    // _id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     auto: true,
    // },

    // character: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'characters',
    //     required: true,
    // },

    spell: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'spells',
        required: true,
    },

    level: {
        type: Number,
        required: true,
        default: 1,
    },

    xp: {
        type: Number,
        required: true,
        default: 0,
    },

    count: {
        type: Number,
        required: true,
        default: 0,
    },

    equipped: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
});

// characterHasSpellSchema.index({character: 1, spell: 1}, {unique : true})

// const CharacterHasSpell = mongoose.model('characters_has_spells', characterHasSpellSchema);

module.exports = characterSpellSchema;