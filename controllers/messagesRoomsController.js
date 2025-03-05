const MessageRoom = require('../models/messages_rooms');


const createMessageRoom = async (req, res, next) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    // try {
    //     const { user, room, party, content, spelled, spelled_by } = req.body;

    //     const message = await MessageRoom.create({ user, room, party, content, spelled, spelled_by });
    //     return res.json({ success: true, message: 'Message posted successfully', message });
    // } catch (error) {
    //     console.error('Error during posting message :', error);
    //     return res.status(500).json({ success: false, message: 'An error occurred during the post of the message' });
    // }
    const { user, room, party, content, spelled = null, spelled_by = null } = req.body;

    try {
        const message = await create({ user, room, party, content, spelled, spelled_by });

        return res.status(201).json({ success: true, message });
    } catch (error) {
        throw { statusCode: error.statusCode, message: error.message || 'Error while creating message in messagesRoomsController' };
    }

}

module.exports = { createMessageRoom };