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
                throw new Error("The passwords do not match");
            }
            return true;
        }),
        body("has_consent", "You must accept the CGU").isBoolean().equals(true),
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
            throw new Error("The username or the email is required");
        }
        return true;
    }),
    body("password", "The password is required").notEmpty(),
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
