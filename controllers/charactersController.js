const Character = require('../models/characters');
const mongoose = require('mongoose');
const characterValidationRules = require('../validators/characterValidator');
const { create, remove, getAllByUserId, getByUserId } = require('../services/characterService');
const Race = require('../models/races');
const Spell = require('../models/spells');

/**
 * Get character by user ID
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const getCharacterByUserId = async (req, res, next) => {
    const { userId: user } = req.params;

    try {
        const character = await getByUserId(user);

        return res.json({ success: true, character });
    } catch (error) {
        next(error);
    }
}

/**
 * Get all characters by user ID
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
const getAllCharactersByUserId = async (req, res, next) => {
    const { characterId: _id, userId: user } = req.params;

    try {
        const characters = await getAllByUserId({ _id, user });

        return res.json({ success: true, characters });
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
        const character = await create({ user, race, gender, avatar });
        return res.json({ success: true, character });
    } catch (error) {
        next(error);
    }
};

const deleteCharacter = async (req, res, next) => {
    const { _id } = req.params;

    try {
        const character = await remove(_id);
        return res.json({ success: true, character });
    } catch (error) {
        next(error);
    }
}

const createCharacterFromSignup = async ({ _id: user, race = new mongoose.Types.ObjectId(), gender, avatar = '' }) => {
    const existingCharacter = await Character.findOne({ user });
    if (existingCharacter) throw { statusCode: 409, message: 'The user already has a character' };

    const theRace = await Race.findOne({ _id: race })
        .select('_id name spells')
        .populate('spells')
        .lean();

    // On récupère les sorts de la race
    const spells = theRace.spells.map(s => ({ spell: s._id }));

    const allSpells = await Spell.find({ category: "active" }).limit(3).select('_id');
    spells.push(...allSpells.map(s => ({ spell: s._id, equipped: true })));

    let newCharacter = new Character({ user, race, gender, avatar, spells: spells });
    await newCharacter.save();

    return newCharacter;

    // newCharacter = await newCharacter.populate([
    //     { path: 'user', select: '_id username' },
    //     { path: 'race', select: '_id name avatar' },
    //     { path: 'spells.spell', select: '_id name description' },
    // ]);

    // return newCharacter;
};

module.exports = {
    characterValidationRules,
    createCharacter,
    createCharacterFromSignup,
    getCharacterByUserId,
    getAllCharactersByUserId,
    deleteCharacter
};
