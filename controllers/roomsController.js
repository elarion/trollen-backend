const User = require("../models/users");
const jwt = require("jsonwebtoken");
const uid2 = require("uid2");

const Room = require("../models/rooms");

const createRoom = async (req, res, next) => {
    try {
        const { user, room_socket_id, name, tags } = req.body;

        const room = await Room.save({
            room_socket_id,
            name,
            user,
            tags: tags,
        });

        res.status(201).json({ success: true, room });
    } catch (error) {
        next(error);
    }
};

module.exports = { createRoom };
