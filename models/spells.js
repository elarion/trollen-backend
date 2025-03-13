const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const levelSchema = new mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },

    lvl: {
        type: Number,
        required: true,
        default: 1
    },

    effect: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    using_count: {      //ajout
        type: Number,
        default: 0
    },

    cooldown: {
        type: Number,
        //required: true,
        default: 0
    },

    target: {
        type: String,
        enum: ["zone", "ennemy", "choice", "self"] //ajout self pour les passive spells
    },

    damage: {
        type: Number,
        required: true,
        default: 0,
    },

    mana_cost: {
        type: Number,
        required: true,
        default: 0,
    },

})

const spellSchema = new mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },

    name: {
        type: String,
        unique: true,
        required: true
    },

    slug: {
        type: String,
        unique: true,
        default: function () {
            return slugify(this.name);
        }
    },

    description: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        enum: ['active', 'passive'],
        default: 'active',
    },

    races: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'races',
        default: [],
    }],

    levels: [levelSchema],

}, {
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
});

const Spell = mongoose.model('spells', spellSchema);

module.exports = Spell;