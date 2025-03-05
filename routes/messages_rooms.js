var express = require('express');
var router = express.Router();

const { messageRoomValidationRules } = require('../validators/messageRoomValidator');
const validateRequest = require('../middlewares/validationRequest');
const errorHandler = require('../middlewares/errorHandler');

const { createMessageRoom, getMessagesRoom } = require('../controllers/messagesRoomsController');

/* GET messages of a Room. */
router.get('/', getMessagesRoom);
router.post('/create/:roomId', messageRoomValidationRules(), validateRequest, createMessageRoom);

router.use(errorHandler);

module.exports = router;
