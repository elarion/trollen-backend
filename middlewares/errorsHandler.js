const { formatMongooseErrors } = require("../utils/formatMongooseErrors");
// This middleware handles errors when they occur
// How to use : 
// 1. Import the middleware : const errorHandler = require("./middlewares/errorsHandler");
// 2. Use the middleware in a route : router.use(errorHandler); 
// at the top of the route after the const router = express.Router();
// 2bis. Or directly in the app.js : app.use(errorHandler);
const errorHandler = (err, req, res, next) => {
    // Error log to console on development
    // err.stack is the stack trace of the error not only the error message
    // So we can have a better understanding of where the error occured
    // for example : 
    // new Error("Error message").stack
    // will show for example:
    // Error message
    //     at myFunction (path/to/myFunction.js:1:3)
    //     at myRoute (path/to/myRoute.js:1:3)
    //     at myApp (path/to/myApp.js:1:3)
    //     at global (path/to/global.js:1:3)
    console.error(err.stack);

    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Mongoose validation error",
            errors: formatMongooseErrors(err),
        });
    // Handle mongoose cast error (invalid type)
    } else if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: "Invalid type value",
            errors: [{ field: err.path, message: "This field has an invalid type value" }],
        });
    }

    // Handle mongoose duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: "Duplicate key error.",
            // Extract the field name from the error object because the error for duplicate key is different from the validation or cast error
            errors: [{ field: Object.keys(err.keyPattern)[0], message: "Ce champ doit être unique." }],
        });
    }

    // Return formatted error if not a mongoose one
    res.status(err.statusCode || 500).json({
        success: false,
        message : err.message || "Internal Server Error",
        errors: err.errors || [],
    });
};

module.exports = errorHandler;

/** How it works : 
 * 1. If an error occurs, the middleware logs the error to the console.
 * 2. It sets the status code to the error's status code or 500 if not specified.
 * 3. It sets the message to the error's message or "Internal Server Error" if not specified.
 * 4. It returns the response with the status code and message.
 */

/** Works with throw new Error("Error message"); in a sync function */
/** Works with throw { statusCode: 400, message: "Error message" }; in an async function (try block) */
/** Works with next(error); in a catch block and will be the thrown error */