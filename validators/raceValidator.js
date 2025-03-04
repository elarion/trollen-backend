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
const raceValidationRules = () => {
    const validationRules = [
        
        //spellSchema
        body("name").trim().notEmpty(),
        body("tagline").trim().notEmpty(),
        body("description").trim().notEmpty(),
        body("avatar").trim().notEmpty(),
        body("spells").trim().notEmpty(),
       

    ];

    return validationRules;
}

module.exports = {
    raceValidationRules,
}