const express = require("express");
const jwt = require("jsonwebtoken");
const { check, body, validationResult } = require("express-validator");
const User = require("../models/users");
const uid2 = require('uid2');
const router = express.Router();
const { createCharacterFromSignup } = require('../controllers/charactersController');

const validationData = [
	body("username", "Le nom est requis").notEmpty(),
	body("email", "Veuillez entrer un email valide").trim().notEmpty().isEmail(),
	body("password", "Le mot de passe doit avoir 6 caractères minimum"),
	//.matches(^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$) 
	// Pour valider un mot de passe qui respecte la règle suivante : 
	// Au moins 6 caractères, Au moins une lettre,Au moins un chiffre,Au moins un caractère spécial (par exemple : !@#$%^&*())
	body('confirmPassword').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Les mots de passe ne correspondent pas');
		}
		return true;
	}),
	body('has_consent', "Vous devez obligatoirement accepter les CGU").isBoolean().equals('true'),
]

router.post("/pre-signup",validationData, async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

			res.status(201).json({ success: true });

	});


//Création compte
router.post("/signup", [...validationData,
		body('user', 'User ID is required').notEmpty(),
    	body('race', 'Race ID is required').notEmpty(),
    	body('gender', 'Gender is required').notEmpty().isIn(['female', 'male', 'non-binary']),
	 ]
	, async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

		try {
			const { username, email, password, gender, race, avatar } = req.body;
			let user = await User.findOne({ email });
			if (user) return res.status(400).json({ message: "Cet email est déjà utilisé" });

			user = new User({ username, email, password, refresh_token: uid2(32), socket_id: uid2(32), has_consent: true  });
			await user.save();
			console.log(user)
			const character = await createCharacterFromSignup({ _id: user._id, gender, race, avatar });

			const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

			res.status(201).json({ success: true, message: 'Utilisateur créé avec succès', token,user,character});
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
        const guestUser = new User({ 
            username: `Guest_${uid2(20)}`,
            role: 'guest',
        });
		await guestUser.save();
        const token = jwt.sign({ id: guestUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ success: true, user: { username: guestUser.username, role: guestUser.role }});
    } catch (error) {
		console.error(error)
        res.status(500).json({ message: 'Erreur lors de la connexion en mode invité' });
    }
})
module.exports = router;
