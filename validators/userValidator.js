const { body } = require("express-validator");

/**
 * Validation rules for user creation
 */
const userValidationRules = (isCharacter = false) => {
    const validationRules = [
        body("username", "Le nom est requis").notEmpty(),
        body("email", "Veuillez entrer un email valide").trim().notEmpty().isEmail(),
        body("password", "The password must have 6 characters minimum").matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Les mots de passe ne correspondent pas");
            }
            return true;
        }),
        body("has_consent", "Vous devez obligatoirement accepter les CGU").isBoolean().equals(true),
    ];

    if (isCharacter) {
        validationRules.push(
            body('user', 'User ID is required').notEmpty(),
            body('race', 'Race ID is required').notEmpty(),
            body('gender', 'Gender is required').notEmpty().isIn(['female', 'male', 'non-binary']),
        );
    }

    return validationRules;
}
/**
 * Validation rules for user signin
 */
const signInValidationRules = () => [
    body("username").custom((value, { req }) => {
        if (!value && !req.body.email) {
            throw new Error("Le username ou l'email est requis");
        }
        return true;
    }),
    body("password", "Le mot de passe est requis").notEmpty(),
];

/**
 * Validation rules for guest user creation
 */
const guestValidationRules = () => [
    body("username").optional(),
];

module.exports = {
    userValidationRules,
    signInValidationRules,
    guestValidationRules
};
