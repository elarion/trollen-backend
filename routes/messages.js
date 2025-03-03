var express = require('express');
var router = express.Router();
const { check, body, validationResult } = require("express-validator");
const Message = require ('../models/messages');

/* GET messages of a Room. */
router.get('/:room', async function(req, res, next) {
  try {  
    const {room} = req.params
  let msg = await Message.find({room});
  
  if (!msg) return res.status(400).json({ success : false, message : 'Aucun message trouvé !'});
  res.status(200).json({result: true, msg});
  } catch (error) {
    console.error(error)
    res.status(500).json({message: "Erreur serveur" })
  }
});


router.post('/',[
    body("content").trim().notEmpty()
], async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array() });
    try {
        const {  user, room, party, content, spelled, spelled_by } = req.body;

        const message = await Message.create({ user, room, party, content, spelled, spelled_by });
        return res.json({ success: true, message: 'Message posted successfully', message });
    } catch (error) {
        console.error('Error during posting message :', error);
        return res.status(500).json({ success: false, message: 'An error occurred during the post of the message' });
    }
});


module.exports = router;
