const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

// Définition du schéma User
const userSchema = new mongoose.Schema({
    // Identifiant unique de l'utilisateur (généré automatiquement par MongoDB)
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Permet de générer automatiquement l'ObjectId
    },

    // Champ indiquant si l'utilisateur a accepté les CGU
    has_consent: {
        type: Boolean,
        required: true, // L'utilisateur doit obligatoirement donner son consentement
        default: false, // Par défaut, le consentement est refusé
    },

    // Identifiant unique de la connexion WebSocket
    socket_id: {
        type: String,
        unique: true, // Un utilisateur ne peut avoir qu'un seul socket_id actif
    },

    // Token de rafraîchissement utilisé pour la gestion des sessions
    refresh_token: {
        type: String,
        required: true, // Obligatoire pour la gestion de l'authentification
        unique: true, // Un utilisateur ne peut pas avoir deux tokens identiques
    },

    // Nom d'utilisateur
    username: {
        type: String,
        required: true, // Obligatoire
        unique: true, // Un username doit être unique
    },

    // Adresse e-mail de l'utilisateur
    email: {
        type: String,
        required: true, // Nécessaire pour l'identification et la récupération du compte
        unique: true, // Une adresse e-mail ne peut être utilisée qu'une seule fois
        match: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, // Vérification du format e-mail
    },

    // Mot de passe (hashé)
    password: {
        type: String,
        required: true, // Obligatoire pour la connexion sécurisée
    },

    // Token temporaire pour la réinitialisation du mot de passe
    reset_password_token: {
        type: String,
        unique: true, // Un utilisateur peut avoir un seul token valide à la fois
        sparse: true, // Permet d'accepter null sans briser l'unicité
    },

    // Date d'expiration du token de réinitialisation du mot de passe
    reset_password_expires: {
        type: Date, // Stocke la date limite d'utilisation du token
    },

    // URL de l'avatar de l'utilisateur (optionnel)
    avatar: {
        type: String,
        default: null, // Par défaut, pas d'avatar
    },

    // Rôle de l'utilisateur (permissions)
    role: {
        type: String,
        enum: ['user', 'admin', 'superuser', 'guest'], // Liste des rôles possibles
        required: true,
        default: 'user', // Par défaut, tout utilisateur est un simple "user"
    },

    // Statut du compte utilisateur
    status: {
        type: String,
        enum: ['active', 'pending', 'suspended', 'banned'], // État du compte
        required: true,
        default: 'pending', // L'utilisateur doit valider son inscription
    },

    // Référence au personnage sélectionné par l'utilisateur
    selected_character: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'characters', // Clé étrangère vers la collection "characters"
        default: null, // Aucun personnage sélectionné par défaut
    },

}, {
    timestamps: true // Ajoute automatiquement les champs "createdAt" et "updatedAt"
});

// Middleware de hashage du password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);

        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
};

// Initialisation du model User
const User = mongoose.model('User', userSchema);


// Export du modèle User
module.exports = User;
