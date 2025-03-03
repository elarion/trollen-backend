const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },

    turn: {
        type: Number,
        required: true,
    },

    action_type: {
        type: String,
        default: 'message',
        enum: ['message', 'attack', 'defense', 'use_item', 'unequipe_item'],
    },

    payload: {
        type: String,
        required: true,
    },
    
},{
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
})

const partySessionSchema = new mongoose.Schema({
    
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },

    party_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    status: {
        type: String,
        default: 'in_progress',
        enum: ['waiting', 'in_progress', 'finished', 'paused']
    },

    turn_number: {
        type: Number,
        default: 1,
    },

    current_turn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },

    turn_order: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'users',
        required: true,
    },

	turn_strat_time: {
		type: Date,
		default: Date.now,
	},

	winner: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        
	},

    actions: actionSchema,

}, {
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
});

const PartySessionSchema = mongoose.model('party_sessions', partySessionSchema);

module.exports = PartySessionSchema;