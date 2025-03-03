const mongoose = require('mongoose');

// Définition du schéma users_friends
const userFriendSchema = mongoose.Schema({
    // Identifiant unique pour chaque relation d’amitié
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Généré automatiquement par MongoDB
    },

    // Premier utilisateur dans la relation d'amitié
    user_id_1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Référence à la collection "users"
        required: true, // Obligatoire : chaque relation doit avoir un premier utilisateur
    },

    // Deuxième utilisateur dans la relation d'amitié
    user_id_2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Référence à la collection "users"
        required: true, // Obligatoire : chaque relation doit avoir un deuxième utilisateur
    },

    // Statut de la relation d’amitié
    status: {
        type: String,
        enum: ['pending', 'rejected', 'accepted'], // Statuts possibles
        required: true, // Obligatoire pour suivre l'état de la relation
        default: 'pending', // Par défaut, une demande d'ami est en attente
    },
}, {
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
});

const UserFriend = mongoose.model('users_friends', userFriendSchema);

module.exports = UserFriend;