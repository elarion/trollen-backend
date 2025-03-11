const Character = require('../models/characters');

const getAllByUserId = async ({ _id, user }) => {
    try {
        const characters = await Character.find({ _id, user })
            .populate([ // créer une méthode générique pour récupérer les données des relations
                { path: 'user', select: '_id username' },
                { path: 'race', select: '_id name' },
                { path: 'spells', select: '_id name' },
            ]);

        return characters;
    } catch (error) {
        throw { statusCode: 500, message: 'Error while getting all characters by userId' };
    }
}

const getByUserId = async (user) => {
    console.log(user);
    try {
        const character = await Character.findOne({ user })
            .populate([
                { path: 'user', select: '_id username' },
                { path: 'race', select: '_id name tagline description avatar spells' },
                { path: 'spells', select: '_id name ' },
            ]);

        if (!character) throw { statusCode: 404, message: 'Character not found' };

        return character;
    } catch (error) {
        throw { statusCode: error.statusCode, message: error.message || 'Error while getting the user\'s character' };
    }
}

const create = async (data) => {
    const { user, avatar, race, gender } = data;

    try {
        const existingCharacter = await Character.findOne({ user }).select('_id');
        if (existingCharacter) throw { statusCode: 409, message: 'The user already has a character' };

        const newCharacter = new Character({
            user,
            avatar,
            race,
            gender
        });

        await newCharacter.save();

        return newCharacter;
    } catch (error) {
        throw { statusCode: error.statusCode, message: error.message || 'Error while creating a room' };
    }
}

const remove = async ({ _id }) => {
    try {
        const character = await Character.findOneAndDelete({ _id });
        if (!character) throw { statusCode: 404, message: 'Character not found' };

        return character
    } catch (error) {
        throw { statusCode: error.statusCode, message: error.message || 'Error while removing a room' };
    }
}

module.exports = {
    create,
    remove,
    getByUserId,
    getAllByUserId,
};