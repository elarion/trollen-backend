const { body } = require('express-validator');

const roomValidationRules = () => [
    body('room_socket_id', 'Room socket ID is required').notEmpty(),
    body('name', 'Room name is required').notEmpty(),
    body('user', 'User is required').notEmpty(),
    body('tags.*.name', 'Tags name is required').notEmpty(),
];

module.exports = { roomValidationRules };