const jwt = require("jsonwebtoken");

// Génère un access token (durée courte)
const generateAccessToken = (user) => {
    const { _id, username, email } = user;
    return jwt.sign({ _id, username, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
};

// Génère un refresh token (durée plus longue)
const generateRefreshToken = (user) => {
    const { _id, username, email } = user;
    return jwt.sign({ _id, username, email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
};

module.exports = { generateAccessToken, generateRefreshToken };