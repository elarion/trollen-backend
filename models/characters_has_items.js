const mongoose = require('mongoose');

const characterHasItemSchema = new mongoose.Schema({
    
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto : true,
    },

    character_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'characters',
        required: true,
    },

    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items',
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
        default: 1,
    },

    equipped: {
        type: Boolean,
        default : false,
    }
}, {
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
});

characterHasItemSchema.index({user_id: 1, item_id: 1}, {unique : true})

const CharacterHasItem = mongoose.model('characters_has_items', characterHasItemSchema);

module.exports = CharacterHasItem;