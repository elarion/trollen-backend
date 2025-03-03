const express = require("express");
const jwt = require("jsonwebtoken");
const { check, body, validationResult } = require("express-validator");
const User = require("../models/users");
const router = express.Router();

router.post("/register", [
    check("name", "Le nom est requis").not().isEmpty(),
    check("email", "Veuillez entrer un email valide").isEmail().matches(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    check("password", "Le mot de passe doit avoir 6 caractères minimum").isLength({ min: 6 }),
    //.matches(^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$) 
    // Pour valider un mot de passe qui respecte la règle suivante : 
    // Au moins 6 caractères, Au moins une lettre,Au moins un chiffre,Au moins un caractère spécial (par exemple : !@#$%^&*())
    check('confirmPassword').custom((value, {req})=>{
      if (value !== req.body.password) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      return true;
    })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Cet email est déjà utilisé" });

        user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
