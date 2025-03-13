var express = require('express');
var router = express.Router();

const { messageRoomValidationRules } = require('../validators/messageRoomValidator');
const validateRequest = require('../middlewares/validationRequest');
const errorHandler = require('../middlewares/errorHandler');
const authenticateToken = require('../middlewares/authenticateToken');
const messageRoomController = require('../controllers/messagesController');

/* GET messages of a Room. */
router.get('/get-all-by-room/:roomId', authenticateToken, messageRoomController.getAllMessagesByRoomId);
router.get('/get-by-last-message/:roomId/:lastMessageId', authenticateToken, messageRoomController.getMessagesByLastMessage);
router.post('/create/:roomId', authenticateToken, messageRoomValidationRules(), validateRequest, messageRoomController.createMessage);

router.use(errorHandler);

module.exports = router;
