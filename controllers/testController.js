const { createTest } = require('../services/testService');

const test = async (req, res, next) => {
    try {
        const newTest = await createTest(req.body);
        return res.status(201).json({ success: true, test: newTest });
    } catch (e) {
        throw { statusCode: 400, message: 'Failed to create test' };
    }
}

module.exports = { test };