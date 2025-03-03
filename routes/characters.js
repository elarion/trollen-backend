var express = require('express');
var router = express.Router();
const { check, body, validationResult } = require("express-validator");

/* POST character */
const validationCharacter = [
	// body("username", "The username is required").not().isEmpty(),
	body("race", "The race is required").not().isEmpty(),
	body("gender", "The gender is required").isIn(['female', 'male', 'non-binary']).not().isEmpty(),
	// body("avatar", "The avatar is required").not().isEmpty(),

];
router.post('/', validationCharacter, async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
	}

	try {
		const { username, race, gender, avatar } = req.body;

		const character = await Character.create({ username, race, gender, avatar });
		return res.json({ success: true, message: 'Character created successfully', character });
	} catch (error) {
		console.error('Error during character creation :', error);
		return res.status(500).json({ success: false, message: 'An error occurred during character creation' });
	}
});

module.exports = router;