const User = require("../models/users");
const jwt = require("jsonwebtoken");
const uid2 = require("uid2");

const Room = require("../models/rooms");
const { createTagsFromRoom } = require("./tagsController");

/**
 * Get all rooms
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const getAllRooms = async (req, res, next) => {
    try {
        const rooms = await Room.find()
            .select('_id room_socket_id name user tags room_settings participants')
            .populate([
                { path: 'room_settings', select: '_id max is_safe is_private' },
                { path: 'tags', select: '_id name slug' },
                { path: 'admin', select: '_id username' },
                {
                    path: 'participants.user',
                    select: '_id username'
                }
            ]);

        res.status(200).json({ success: true, rooms });
    } catch (error) {
        next(error);
    }
};

/**
 * Get a room by id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const getRoomById = async (req, res, next) => {
    try {
        const room = await Room.findById(req.params.id).populate([
            { path: 'room_settings', select: '_id max is_safe is_private' },
            { path: 'tags', select: '_id name slug' },
            { path: 'admin', select: '_id username' },
            { path: 'participants.user', select: '_id username' }
        ]);

        if (!room) throw { statusCode: 404, message: 'Room not found' };

        res.status(200).json({ success: true, room });
    } catch (error) {
        next(error);
    }
};

/**
 * Create a room
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const createRoom = async (req, res, next) => {
    try {
        const { user, room_socket_id, name, tags } = req.body;

        const newTags = await createTagsFromRoom(tags);

        const newRoom = new Room({
            room_socket_id,
            name,
            admin: user,
            participants: [{
                user: user,
                role: 'admin',
            }],
            tags: newTags,
        });

        await newRoom.save();

        const room = await Room.findById(newRoom._id)
            .select('_id room_socket_id name user tags room_settings participants')
            .populate([
                { path: 'room_settings', select: '_id max is_safe is_private' },
                { path: 'tags', select: '_id name slug' },
                { path: 'admin', select: '_id username' },
                {
                    path: 'participants.user',
                    select: '_id username'
                }
            ])
            .lean();

        res.status(201).json({ success: true, room: room });
    } catch (error) {
        next(error);
    }
};

/**
 * Update a room
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const joinRoom = async (req, res, next) => {
    try {
        const { user } = req.body;

        console.log('req.params.id =>', req.params.id);

        const room = await Room.findByIdAndUpdate(req.params.id, {
            $push:
            {
                participants: {
                    user: user,
                    role: 'troll'
                }
            }
        }, { new: true });

        if (!room) throw { statusCode: 404, message: 'Room not found' };

        res.status(200).json({ success: true, room });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a room
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const deleteRoom = async (req, res, next) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);

        if (!room) throw { statusCode: 404, message: 'Room not found' };

        res.status(200).json({ success: true, room });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllRooms,
    getRoomById,
    createRoom,
    joinRoom,
    deleteRoom
};


// {
//     "room_socket_id" : "211DDDD1DDDDDdDDDS1A",
//         "user" : "67c5dbe3806a4fef1d0ee35d",
//             "name" : "Room 91DDDADdDDDDDDSDA",
//                 "tags" : [
//                     {
//                         "name": "Hola"
//                     },
//                     {
//                         "name": "Node.js"
//                     },
//                     {
//                         "name": "MongoDB"
//                     }
//                 ]
// }