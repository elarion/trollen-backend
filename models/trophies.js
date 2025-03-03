const mongoose = require('mongoose');

const trophySchema = new mongoose.Schema({
    
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
    },

    category: {
        type: String, 
        enum: ['combat','exploration', 'social', '...'],
        required: true,
    },

}, {
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
});

const Trophy = mongoose.model('trophies', trophySchema);

module.exports = Trophy;