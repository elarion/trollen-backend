const formatMongooseErrors = require("../utils/formatMongooseErrors");
// This middleware handles errors when they occur
// How to use : 
// 1. Import the middleware : const errorHandler = require("./middlewares/errorsHandler");
// 2. Use the middleware in a route : router.use(errorHandler); 
// at the bottom of the route after the last route and before the export
// 2bis. Or directly in the app.js : app.use(errorHandler);

const errorHandler = (err, req, res, next) => {
    console.log('Error handler =>', err);
    // Normalize the error object when it's not an instance of Error
    // That is to say: if the error is not an instance of the Error class, tout simplement
    // It means for example that if we throw an object like { message: "Error message", statusCode: 400 }
    // It will be converted to an instance of the Error class with the message and statusCode properties
    // If you want to test it, you can do the following in a route for example:
    // res.status(400).json({ message: "Error message", statusCode: 400 });
    // another way to test it is to throw an object in a try block in an async function for example:
    // throw { message: "Error message", statusCode: 400 };
    // It will be converted to an instance of the Error class with the message and statusCode properties
    // because I want to have a consistent error object to work with
    if (!(err instanceof Error)) {
        const { message, statusCode, errors } = err;
        err = new Error(message || "Internal Server Error");
        err.statusCode = statusCode || 500;
        err.errors = errors || [];
        Error.captureStackTrace(err, errorHandler);
    }

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
    console.error('Stack trace =>', err.stack);

    // Return formatted error if not a mongoose one
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
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