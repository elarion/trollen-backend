const mongoose = require('mongoose');
const SubdocPartyParticipantsSchema = require("./subdoc_party_participants");
const partySchema = new mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },

    game: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'games',
        index: true,
    },

    name: {
        type: String,
        unique: true,
        required: true
    },

    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },

    join_id: {
        type: String,
        unique: true,
        required: true
    },

    // party_socket_id: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },

    participants: [SubdocPartyParticipantsSchema],

}, {
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
});

const Party = mongoose.model('parties', partySchema);

module.exports = Party;