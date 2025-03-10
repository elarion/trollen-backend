const User = require("../models/users");
const jwt = require("jsonwebtoken");
const uid2 = require("uid2");
const { createCharacterFromSignup } = require("./charactersController");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const { modifyProfileService} = require("../services/userService")


const preSignup = async (req, res, next) => {
    try {
        res.status(201).json({ success: true, user: req.body });
    } catch (error) {
        next(error);
    }
};

/**
 * Signup
 */
const signup = async (req, res, next) => {
    try {
        const { username, email, password, gender, race, avatar } = req.body;

        const user = new User({
            username,
            email,
            password,
        });

        await user.save();

        const character = await createCharacterFromSignup({ _id: user._id, gender, race, avatar });

        // Generate a JWT token for the user
        // The JWT is composed in three parts :
        // - The payload : the data we want to store in the token { id: user._id }
        // - The signature : a secret key to verify the token process.env.JWT_SECRET
        // - The expiration : the date of the token's expiration { expiresIn: env.JWT_EXPIRATION_TIME }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refresh_token = refreshToken;
        await user.save();

        res.status(201).json({ success: true, message: "Utilisateur créé avec succès", accessToken, refreshToken, user, character });
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

        if (!user) throw new CustomError("Username or email is invalid", 400);

        const check = await user.comparePassword(password);
        if (!check) throw new CustomError("Password incorrect", 400);

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refresh_token = refreshToken;
        await user.save();

        res.status(200).json({ success: true, message: "Connexion réussie", accessToken, refreshToken, user });
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

const logout = async (req, res, next) => {
    try {
        const { refreshToken: refresh_token } = req.body;
        if (!refresh_token) {
            throw new CustomError("No token provided", 400);
        }

        // Suppression du token en base de données
        // on utilise $unset pour supprimer le champ refreshToken, cela veut dire qu'il disparait de la base de données
        // mais on pourrait aussi faire 
        await User.updateOne({ refresh_token }, { $unset: { refresh_token: 1 } });

        return res.status(200).json({ success: true, message: "Déconnexion réussie" });
    } catch (error) {
        next(error);
    }

}



const modifyProfile = async (req, res, next) => {

    const {username} = req.body;
    
    try {
        console.log('controller :', username)
        const newUsername = await modifyProfileService(username);
        console.log('New username (back controller after services) :', newUsername)

        return res.status(200).json({ success: true, newUsername});
    } catch (error) {
        next(error);
    }

}


module.exports = {
    preSignup,
    signup,
    signin,
    signupGuest,
    logout,
    modifyProfile,
};