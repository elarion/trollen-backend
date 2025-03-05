var express = require('express');
var router = express.Router();

const { messageRoomValidationRules } = require('../validators/messageRoomValidator');
const validateRequest = require('../validators/validationRequest');
const errorHandler = require('../middlewares/errorHandler');

const { createMessageRoom } = require('../controllers/messagesRoomsController');

/* GET messages of a Room. */
router.get('/:room', async function (req, res, next) {
	try {
		const { room } = req.params
		let msg = await MessageRoom.find({ room });

		if (!msg) return res.status(400).json({ success: false, message: 'Aucun message trouvé !' });
		res.status(200).json({ result: true, msg });
	} catch (error) {
		res.status(500).json({ message: "Erreur serveur" })
	}
});

router.post('/', messageRoomValidationRules(), validateRequest, createMessageRoom);

router.use(errorHandler);

module.exports = router;
