const RoomSettings = require('../models/subdoc_room_settings');

const createRoomSettingsFromRoom = async function (doc, next) {
    console.log('room settings =>', doc);
    const { _id } = doc;

    try {
        const newRoomSettings = new RoomSettings({
            room: _id,
        });

        await newRoomSettings.save();

        await this.updateOne({ room_settings: newRoomSettings._id });

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = { createRoomSettingsFromRoom };
