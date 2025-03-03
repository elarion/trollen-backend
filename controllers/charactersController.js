const Character = require('../models/characters');

const createCharacter = async ({ user_id, race, gender, avatar }) => {
    try {
        const newCharacter = await Character.create({
            user_id,
            race,
            gender,
            avatar
        });

        await newCharacter.save();

        return newCharacter;
    } catch (error) {
        throw new Error("Erreur lors de la création du personnage : " + error.message);
    }
};

module.exports = createCharacter;