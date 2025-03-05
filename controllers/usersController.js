const User = require("../models/users");
const jwt = require("jsonwebtoken");
const uid2 = require("uid2");
const { createCharacterFromSignup } = require("./charactersController");


const preSignup = async (req, res) => {
    res.status(201).json({ success: true });
};

/**
 * Signup
 */
const signup = async (req, res, next) => {
    try {
        const { username, email, password, gender, race, avatar } = req.body;

        let user = await User.findOne({ email });
        if (user) throw { statusCode: 400, message: "Cet email est déjà utilisé" };

        user = new User({
            username,
            email,
            password,
            refresh_token: uid2(32),
            socket_id: uid2(32),
        });

        await user.save();

        const character = await createCharacterFromSignup({ _id: user._id, gender, race, avatar });

        // Generate a JWT token for the user
        // The JWT is composed in three parts :
        // - The payload : the data we want to store in the token { id: user._id }
        // - The signature : a secret key to verify the token process.env.JWT_SECRET
        // - The expiration : the date of the token's expiration { expiresIn: env.JWT_EXPIRATION_TIME }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ success: true, message: "Utilisateur créé avec succès", token, user, character });
    } catch (error) {
        next(error);
    }
};

/**
 * Login
 */
const signin = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (!user) {
            throw { statusCode: 400, message: "Utilisateur non trouvé" };
        }

        const check = await user.comparePassword(password);
        if (!check) {
            throw { statusCode: 400, message: "Mot de passe invalide" };
        }

        const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ success: true, message: "Connexion réussie", token });
    } catch (error) {
        next(error);
    }
};

/**
 * Guest signup
 */
const signupGuest = async (req, res, next) => {
    try {
        const guestUser = new User({
            username: `Guest_${uid2(20)}`,
            role: "guest",
        });

        await guestUser.save();

        const token = jwt.sign({ id: guestUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({ success: true, user: { username: guestUser.username, role: guestUser.role }, token });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    preSignup,
    signup,
    signin,
    signupGuest
};