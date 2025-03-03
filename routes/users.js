const express = require("express");
const jwt = require("jsonwebtoken");
const { check, body, validationResult } = require("express-validator");
const User = require("../models/users");
const uid2 = require('uid2');
const router = express.Router();
//Création compte
router.post("/signup",
	[
		body("username", "Le nom est requis").not().isEmpty(),
		body("email", "Veuillez entrer un email valide").isEmail().matches(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/),
		body("password", "Le mot de passe doit avoir 6 caractères minimum").isLength({ min: 6 }),
		//.matches(^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$) 
		// Pour valider un mot de passe qui respecte la règle suivante : 
		// Au moins 6 caractères, Au moins une lettre,Au moins un chiffre,Au moins un caractère spécial (par exemple : !@#$%^&*())
		body('confirmPassword').custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Les mots de passe ne correspondent pas');
			}
			return true;
		})
	], async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		try {
			const { username, email, password } = req.body;
			let user = await User.findOne({ email });
			if (user) return res.status(400).json({ message: "Cet email est déjà utilisé" });

			user = new User({ username, email, password, refresh_token: uid2(32), socket_id: uid2(32) });
			await user.save();

			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

			res.status(201).json({ success: true, message: 'Utilisateur créé avec succès', token, user });
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: "Erreur serveur" });
		}
	});



// connexion compte
router.post('/signin',
	[
		body("username").custom((value, { req }) => {
			if (!value && !req.body.email) {
				throw new Error("Le username ou l'email est requis");
			}
			return true;
		}),
		body("password", "Le mot de passe est requis").not().isEmpty(),
	], async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		try {
			const { username, password, email } = req.body;
			const user = await User.findOne({ $or: [{ username }, { email }] });
			if (!user) return res.status(400).json({ success: false, message: 'Utilisateur non trouvé' });
			const check = await user.comparePassword(password);
			if (!check) return res.status(400).json({ sucess: false, message: 'Password invalid' });
			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        	res.status(200).json({ success: true, message: 'Connexion réussie', token });
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: "Erreur serveur" });
		}
	});

	// mode invité
router.post('/signup-guest', async (req, res) =>{
	try {
        const guestUser = {
            id: `guest_${Date.now()}`, 
            username: 'Guest',
            role: 'guest',
        };

        const token = jwt.sign(guestUser, 'SECRET_KEY', { expiresIn: '1h' });

        res.json({ user: guestUser, token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion en mode invité' });
    }
})
module.exports = router;
