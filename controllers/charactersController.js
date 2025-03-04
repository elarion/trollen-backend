const Character = require('../models/characters');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const characterValidationRules = require('../validators/characterValidator');


/**
 * Get all characters by user ID
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const getAllCharactersByUserId = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const characters = await Character.find({ user: userId });

        return res.json({ success: true, characters });
    } catch (error) {
        next(error);
    }
}

/**
 * Get character by user ID
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const getCharacterByUserId = async (req, res, next) => {
    const { characterId, userId } = req.params;

    try {
        const character = await Character.findOne({ _id: characterId, user: userId });

        if (!character) throw { statusCode: 404, message: 'Character not found' };

        return res.json({ success: true, character });
    } catch (error) {
        next(error);
    }
}

/**
 * Create a character
 */
const createCharacter = async (req, res, next) => {
    const { user, race = new mongoose.Types.ObjectId(), gender, avatar = '' } = req.body;

    try {
        // check if user already has a character
        const existingCharacter = await Character.findOne({ user });
        if (existingCharacter) {
            throw { statusCode: 409, message: 'The user already has a character' };
        }

        const newCharacter = new Character({ user, race, gender, avatar });
        await newCharacter.save();

        return res.json({ success: true, character: newCharacter });
    } catch (error) {
        next(error);
    }
};

const createCharacterFromSignup = async ({ _id: user, race = new mongoose.Types.ObjectId(), gender, avatar = '' }) => {
    const existingCharacter = await Character.findOne({ user });
    if (existingCharacter) throw { statusCode: 409, message: 'The user already has a character' };

    const newCharacter = new Character({ user, race, gender, avatar });
    await newCharacter.save();

    return newCharacter;
};


module.exports = {
    characterValidationRules,
    createCharacter,
    createCharacterFromSignup,
    getCharacterByUserId,
    getAllCharactersByUserId
};
