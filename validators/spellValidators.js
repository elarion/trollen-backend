const { body } = require('express-validator');

/**
 * Validation rules for character creation
 * arrow function to avoid caching issues
 * can be personnalised with params to permit specific rules
 * for example : 
 * characterValidationRules({ isUpdate: true })
 */

/**
 * Validation rules for spell creation
 */
const spellValidationRules = () => {
    const validationRules = [
        
        //spellSchema
        body("name").trim().notEmpty(),
        body("description").trim().notEmpty(),
        body("image").trim().notEmpty(),
        body("category").trim().notEmpty(),
        body("races").trim().notEmpty(),
        //levelSchema
        body("levels.*.lvl").trim().notEmpty(),
        body("levels.*.effect").trim().notEmpty(),
        body("levels.*.image").trim().notEmpty(),
        body("levels.*.cooldown").trim().notEmpty(),
        body("levels.*.target").trim().notEmpty(),
        body("levels.*.damage").trim().notEmpty(),
        body("levels.*.mana_cost").trim().notEmpty(),

    ];

    return validationRules;
}

module.exports = {
    spellValidationRules,
}