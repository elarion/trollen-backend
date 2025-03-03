const mongoose = require('mongoose');

const roomFavoriteSchema = new mongoose.Schema({
    // Identifiant unique de l'entrée
    _id: { 
        type: mongoose.Schema.Types.ObjectId, 
        auto: true 
    },

    // Identifiant de l’utilisateur ayant ajouté la salle en favori
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',  // Référence vers la collection `users`
        required: true, // Un favori doit être lié à un utilisateur
        index: true,   // Optimisation pour retrouver rapidement les favoris d'un utilisateur
    },

    // 🏠 Identifiant de la salle favorite
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms', // Référence vers la collection `rooms`
        required: true, // Un favori doit obligatoirement concerner une salle
        index: true,    // Accélère les recherches des favoris d'une salle
    },
}, { timestamps: true });

// Index unique pour éviter qu'un utilisateur ajoute plusieurs fois la même salle en favori
roomFavoriteSchema.index({ user_id: 1, room_id: 1 }, { unique: true });

const RoomFavorite = mongoose.model('rooms_favorites', roomFavoriteSchema);

module.exports = RoomFavorite;
