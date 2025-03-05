const Test = require('../models/testModel');

const create = async ({ name, desc }) => {
    try {
        const existingCharacter = await Test.findOne({ name }).select('_id');
        if (existingCharacter) throw { statusCode: 409, message: 'The test already exists' };

        const test = new Test({ name, desc });
        await test.save();

        return test;
    } catch (error) {
        throw { statusCode: error.statusCode, message: error.message };
    }
}

module.exports = { create };