const { body } = require('express-validator');

const messageRoomValidationRules = () => [
    // body('user').notEmpty().isMongoId(),
    // body('room').notEmpty().isMongoId(),
    body('content').trim().notEmpty(),
    body('spelled').optional().isMongoId(),
    body('spelled_by').optional().isMongoId(),
];

module.exports = { messageRoomValidationRules };