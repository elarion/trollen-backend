var express = require('express');
var router = express.Router();
const { check, body, validationResult } = require("express-validator");

/* POST character */
const validationCharacter = [
	body("username", "The username is required").not().isEmpty(),
	body("race", "The race is required").not().isEmpty(),
	body("gender", "The gender is required").enum(['female', 'male', 'non-binary']).not.isEmpty(),
	// body("avatar", "The avatar is required").not().isEmpty(),
	
];
router.post('/', validationCharacter, async (req, res, next) => {
	try {
		
	} catch (error) {
		console.error('Error during character creation :', error);
		return res.json({ success: false, message: 'An error occurred during character creation' });
	}
});

module.exports = router;