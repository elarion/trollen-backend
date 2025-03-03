const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
    
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto : true,
    },

    trophy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'games',
        index: true,
    },

    level_name: {
        type: String,
        enum: ['bronze','silver','gold','platinum'],
        required: true
    },

    condition_type: {
        type: String,
        enum: ['wins','kills','messages','sent','rooms','joined','...'],
        required: true
    },

    condition_value: {
        type: Number,
        required: true,
    },

    reward: {
        type:String,
    },

    image: {
        type: String,
    },

}, {
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
});

const Party = mongoose.model('parties', partySchema);

module.exports = Party;