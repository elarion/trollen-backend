const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    try {
        // Vérifier si l'Authorization header est présent
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Access denied, no token provided" });
        }

        // Extraire le token de l'en-tête
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access denied, invalid token format" });
        }

        // Vérifier et décoder le token JWT
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token" });
            }

            // Ajouter les infos de l'utilisateur à `req.user`
            req.user = decoded;

            // Passer au middleware suivant
            next();
        });
    } catch (error) {
        console.error("Error in authenticateToken middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = authenticateToken;
