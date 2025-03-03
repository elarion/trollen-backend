const mongoose = require('mongoose');

const logActionSchema = new mongoose.Schema({
    
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

}, {
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
});

const LogAction = mongoose.model('logs_actions', logActionSchema);

module.exports = LogAction;