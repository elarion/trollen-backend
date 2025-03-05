const jwt = require("jsonwebtoken");

// Génère un access token (durée courte)
const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
};

// Génère un refresh token (durée plus longue)
const generateRefreshToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
};

module.exports = { generateAccessToken, generateRefreshToken };