const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]; // get authorization header
    const token = authHeader && authHeader.split(" ")[1]; // get token from authorization header

    if (!token) return res.status(401).json({ message: "Access denied" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or expired token" });

        req.user = user;

        next();
    });
};

module.exports = authenticateToken;
