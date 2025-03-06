const mongoose = require('mongoose');

const roomSettingSchema = mongoose.Schema({
    // Nombre maximum de participants autorisés
    max: {
        type: Number,
        default: 0, // Valeur par défaut  (à ajuster si besoin)
        min: 0, // Ne peut pas être négatif
    },

    // Indique si la salle est sécurisée (contenu modéré)
    is_safe: {
        type: Boolean,
        default: false, // Par défaut, la salle n'est pas modérée
    },

    // Détermine si la salle est privée ou publique
    is_private: {
        type: Boolean,
        default: false, // Par défaut, les salles sont privées
    },

    // Mot de passe pour rejoindre une salle privée (optionnel)
    password: {
        type: String, // Stockage d'un hash si nécessaire
        default: null,
    },
});

// const RoomSettings = mongoose.model('room_settings', roomSettingSchema);

module.exports = roomSettingSchema;
