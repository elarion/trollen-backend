const Character = require('../models/characters');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

/**
 * Middleware to validate character data
 */
const validateCharacter = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    next();
};

/**
 * Create a character
 */
const createCharacter = async ({ user, race, gender, avatar = '' }) => {
    try {
        if (!user || !race || !gender) {
            throw { statusCode: 400, message: 'Champs requis manquants pour la création du personnage' };
        }

        // check if user already has a character
        const existingCharacter = await Character.findOne({ user });
        if (existingCharacter) {
            throw { statusCode: 409, message: 'L\'utilisateur a déjà un personnage' };
        }

        const character = await Character.create({ user, race, gender, avatar });
        return character;
    } catch (error) {
        throw error;
    }
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
};

module.exports = {
    characterValidationRules,
    validateCharacter,
    createCharacter,
    createCharacterFromSignup
};
