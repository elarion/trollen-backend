const { validationResult } = require('express-validator');

/**
 * Generic middleware to validate a request with express-validator
 */
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // I prefer using a return res.status(400).json(...) instead of the middlware errorHandler
        // It's more explicit and I want to have more control over the response regarding the validation errors
        // I believe it's two different things.
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    // if (!errors.isEmpty()) {
    //     const error = new Error("Validation failed");
    //     error.statusCode = 400;
    //     error.errors = errors.array();
    //     return next(error);
    // }
    next();
};

module.exports = validateRequest;