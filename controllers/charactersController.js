const Character = require('../models/characters');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

/**
 * Règles de validation des personnages
 */
const characterValidationRules = () => [
    body('user', 'User ID is required').notEmpty(),
    body('race', 'Race ID is required').notEmpty(),
    body('gender', 'Gender is required').notEmpty().isIn(['female', 'male', 'non-binary']),
];

/**
 * Middleware pour valider les requêtes de création de personnage
 */
const validateCharacter = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    next();
};

const createCharacter = async ({ user, race, gender, avatar = '' }) => {
    if (!user || !race || !gender) {
        throw new Error('Missing required fields for character creation');
    }

    // Vérifie si l'utilisateur a déjà un personnage
    const existingCharacter = await Character.findOne({ user });
    if (existingCharacter) {
        throw new Error('User already has a character');
    }

    return await Character.create({ user, race, gender, avatar });
};

const createCharacterFromSignup = async (userData) => {
    const { _id: user, race = new mongoose.Types.ObjectId(), gender, avatar = '' } = userData;

    if (!user || !race || !gender) {
        throw new Error('Missing required fields for character creation');
    }

    const existingCharacter = await Character.findOne({ user });
    if (existingCharacter) {
        throw new Error('User already has a character');
    }

    return await Character.create({ user, race, gender, avatar });
    // return createCharacter({ user, race, gender, avatar });
};

console.log(new mongoose.Types.ObjectId());

module.exports = {
    characterValidationRules,
    validateCharacter,
    createCharacter,
    createCharacterFromSignup
};
