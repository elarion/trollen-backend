const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },

    lvl: {
        type: Number,
        required: true,
        default: 1
    },

    effect :{
        type: String,
        required: true,
    },

    image :{
        type: String,
        required: true,
    },

    cooldown:{
        type: Number,
        require: true,
        default: 0
    },

    target:{
        type: String,
        enum: [zone, ennemy, choice]
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

    image: {
        type: String,
        required: true,
    },

    category: {
        type: String, 
        enum: ['weapon','armor','consumeable','miscelleanous'],
        required: true,
    },

    rarity: {
        type: String,
        enum: ['common','rare', 'legendary']
    },

    usable_in: {
        type: String,
        enum: ['room','party','any']
    },

    effects: effectSchema,

}, {
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
});

const Item = mongoose.model('items', itemSchema);

module.exports = Item;