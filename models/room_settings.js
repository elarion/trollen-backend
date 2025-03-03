const mongoose = require('mongoose');

const roomSettingSchema = mongoose.Schema({
    // Identifiant unique de la configuration de la salle
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },

    // Référence vers la salle concernée
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rooms',  // 📎 Référence vers la collection `rooms`
        required: true, // Un paramètre de salle doit obligatoirement être lié à une salle
        index: true,   // Optimisation pour retrouver rapidement les paramètres d'une salle
        unique: true,  // Chaque salle ne peut avoir qu'une seule configuration
    },

    // Nombre maximum de participants autorisés
    max: {
        type: Number,
        required: true,  // Ce champ est obligatoire
        default: 0,      // Valeur par défaut illimitée (à ajuster si besoin)
        min: 0,          // Ne peut pas être négatif
    },

    // Indique si la salle est sécurisée (contenu modéré)
    is_safe: {
        type: Boolean,
        required: true,  // Ce champ est obligatoire
        default: false,  // Par défaut, la salle n'est pas modérée
    },

    // Détermine si la salle est privée ou publique
    is_private: {
        type: Boolean,
        required: true, // Ce champ est obligatoire
        default: true,  // Par défaut, les salles sont privées
    },

    // Mot de passe pour rejoindre une salle privée (optionnel)
    password: {
        type: String, // Stockage d'un hash si nécessaire
    },
}, { timestamps: true });

const RoomSettings = mongoose.model('room_settings', roomSettingSchema);

module.exports = RoomSettings;
