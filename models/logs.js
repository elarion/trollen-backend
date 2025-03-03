const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto : true,
    },

    action: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'logs_actions',
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },

}, {
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
});

const Log = mongoose.model('logs', logSchema);

module.exports = Log;