const roomService = require("../services/roomService");

/**
 * Get a room by id
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const getRoomById = async (req, res, next) => {
    try {
        const room = await roomService.getById(req.params.id);

        res.status(200).json({ success: true, room });
    } catch (error) {
        next(error);
    }
};

const getRoomByName = async (req, res, next) => {
    try {
        const room = await roomService.getByName(req.params.name);

        res.status(200).json({ success: true, room });
    } catch (error) {
        next(error);
    }
}

const getRoomsByLimit = async (req, res, next) => {
    try {
        if (!req.query.page || !req.query.limit) throw new CustomError('Please provide ?page=<nextpagenumber>&limit=25 in query params of your fetch', 400);

        const rooms = await roomService.getByLimit(req.query);

        res.status(200).json({ success: true, rooms });
    } catch (error) {
        next(error)
    }
}

/**
 * Get all rooms
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const getAllRooms = async (req, res, next) => {
    try {
        const rooms = await roomService.getAll();

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
        const user = req.user;
        const room = await roomService.create({ ...req.body, user });

        req.io.emit("newRoom", { room });

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
const joinRoomById = async (req, res, next) => {
    try {
        const room = await roomService.joinById({ _id: req.params.id, user: req.body.user, password: req.body.password });

        // io.to("newRoom", room);
        // io.to(room._id.toString()).emit("roomInfo", { room });

        return res.status(200).json({ success: true, room });
    } catch (error) {
        next(error);
    }
};

const joinRoomByName = async (req, res, next) => {
    try {
        const room = await roomService.joinByName({ name: req.params.name, user: req.user, password: req.body.password });

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
        const room = await roomService.remove(req.params.id);

        res.status(200).json({ success: true, room });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllRooms,
    getRoomById,
    getRoomsByLimit,
    createRoom,
    joinRoomById,
    joinRoomByName,
    deleteRoom,
    getRoomByName
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