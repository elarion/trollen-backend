// Utility to format Mongoose validation errors to fit as an express validator error
// Haven't tested it yet
const formatMongooseErrors = (error) => {
    return Object.keys(error.errors).map((field) => ({
        field,
        message: error.errors[field].message
    }));
};

module.exports = formatMongooseErrors;