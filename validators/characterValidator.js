const { body } = require('express-validator');

/**
 * Validation rules for character creation
 * arrow function to avoid caching issues
 * can be personnalised with params to permit specific rules
 * for example : 
 * characterValidationRules({ isUpdate: true })
 */
const characterValidationRules = () => [
    // body('user', 'User ID is required').notEmpty(),
    body('race', 'Race ID is required').notEmpty(),
    body('gender', 'Gender is required').optional().isIn(['female', 'male', 'non-binary']),
];

module.exports = { characterValidationRules };
