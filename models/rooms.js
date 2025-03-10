const mongoose = require('mongoose');
const roomSettingSchema = require('./subdoc_room_settings');
const participantSchema = require('./subdoc_room_participants');
const bcryptjs = require('bcryptjs');

const roomSchema = new mongoose.Schema({
    // Identifiant unique de la salle
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },

    // Identifiant unique pour la gestion des WebSockets
    room_socket_id: {
        type: String,
        // required: true, // Ce champ est obligatoire
        // unique: true,  // Il doit être unique pour éviter les conflits
        // index: true,  // Accélère les recherches basées sur le room socket id
    },

    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },

    participants: [participantSchema], // Liste des participants
    settings: { // Paramètres de la salle
        type: roomSettingSchema,
        default: () => ({}) // Crée un objet vide par défaut
    },

    // Nom de la salle
    name: {
        type: String,
        required: true, // Un nom est nécessaire pour identifier la salle
        trim: true,     // Supprime les espaces inutiles en début et fin
        unique: true,
        index: true,    // Crée un index pour accélérer les recherches
    },

    // Description de la salle (optionnel)
    description: {
        type: String,
        default: null, // Peut être null si aucune description n'est fournie
        trim: true,
    },

    // Liste des tags associés à la salle
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tags',  // Référence vers la collection `tags`
    }],
}, { timestamps: true });

roomSchema.pre('save', async function (next) {
    try {
        if (this.settings.password) {
            const salt = await bcryptjs.genSalt(10);
            this.settings.password = await bcryptjs.hash(this.settings.password, salt);
        }

        next();
    } catch (error) {
        next(error);
    }
});

roomSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.settings.password);
};

const Room = mongoose.model('rooms', roomSchema);

module.exports = Room;
