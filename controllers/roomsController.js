const {
    getAll,
    getById,
    create,
    join,
    remove
} = require("../services/roomService");


/**
 * Get a room by id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const getRoomById = async (req, res, next) => {
    try {
        const room = await getById(req.params.id);

        res.status(200).json({ success: true, room });
    } catch (error) {
        next(error);
    }
};
/**
 * Get all rooms
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const getAllRooms = async (req, res, next) => {
    try {
        const rooms = await getAll();

        res.status(200).json({ success: true, rooms });
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
        const room = await create(req.body);

        res.status(201).json({ success: true, room });
    } catch (error) {
        next(error);
    }
};

/**
 * Join a room
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const joinRoom = async (req, res, next) => {
    try {
        const room = await join({ _id: req.params.id, user: req.body.user, password: req.body.password });

        return res.status(200).json({ success: true, room });
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
        const room = await remove(req.params.id);

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
//     "room_socket_id" : "21DDDDdDDDS1A",
//         "user" : "67c72cdcfda87040021e6fbf",
//             "name" : "Room 91DdDDDDDSDA",
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
//                 ],
//                     "settings": {
//         "max": 8,
//             "is_safe": true,
//                 "is_private": false,
//                     "password": null
//     }
// }