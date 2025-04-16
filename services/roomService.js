const Room = require('../models/rooms');
const { createTagsFromRoom } = require('../services/tagService');
const uid2 = require('uid2');

const getAll = async () => {
    try {
        const rooms = await Room.find()
            .select('_id room_socket_id name user tags settings participants')
            .populate([
                { path: 'tags', select: '_id name slug' },
                { path: 'admin', select: '_id username' },
                { path: 'participants.user', select: '_id username' }
            ]);

        return rooms;
    } catch (error) {
        throw error;
    }
};

const getById = async (id) => {
    try {
        const room = await Room.findById(id)
            .select('_id room_socket_id name user tags settings participants')
            .populate([
                { path: 'tags', select: '_id name slug' },
                { path: 'admin', select: '_id username' },
                { path: 'participants.user', select: '_id username socket_id' }
            ]);

        if (!room) throw new CustomError('Room not foundsss', 404);

        return room;
    } catch (error) {
        throw error;
    }
}

const getByLimit = async ({ page = Number(page) || 1, limit = Number(limit) || 25 }) => {
    try {
        const skip = (page - 1) * limit;

        const rooms = await Room.find()
            .where('settings.is_private').equals(false)
            .skip(skip)
            .limit(limit)
            .select('_id room_socket_id name user tags settings participants')
            .populate([
                { path: 'tags', select: '_id name slug' },
                { path: 'admin', select: '_id username' },
                { path: 'participants.user', select: '_id username email' }
            ])
            .sort({ createdAt: -1 })
            .lean();

        return rooms
    } catch (error) {
        throw error;
    }
}


const create = async (data) => {
    // user is the id of the user who created the room
    const { user, room_socket_id, name, tags, settings = {} } = data;

    console.log('settings =>', settings);
    try {
        // a mettre après la création de la room comme ça si fail de la save de la room, les tags ne sont pas créés
        const newTags = await createTagsFromRoom(tags);

        const newRoom = new Room({
            room_socket_id: uid2(20),
            name,
            admin: user._id,
            participants: [{
                user: user._id,
                role: 'admin',
            }],
            tags: newTags,
            settings,
        });

        await newRoom.save();

        const room = await Room.findById(newRoom._id)
            .select('_id room_socket_id name user tags settings participants')
            .populate([
                { path: 'tags', select: '_id name slug' },
                { path: 'admin', select: '_id username' },
                { path: 'participants.user', select: '_id username' }
            ])
            .lean();

        return room;
    } catch (error) {
        throw error;
    }
}

const joinById = async ({ _id, user, password = '' }) => {
    try {
        // Check if the room exists
        const isExist = await Room.findById(_id).select('_id settings participants');
        if (!isExist) throw new CustomError('Room not found', 404);

        // Check if the room is password protected
        if (isExist.settings.password && !(await isExist.comparePassword(password)))
            throw new CustomError('Password is incorrect', 423);

        // Check if the room is full
        if (isExist.settings.max > 0 && isExist.settings.max === isExist.participants.length)
            throw new CustomError('Room is full', 400);

        // Check if the user is already in the room
        const isAlreadyIn = isExist.participants.some(participant => participant.user?.toString() === user);
        if (isAlreadyIn) throw new CustomError('User already in room', 400);

        const room = await Room.updateOne({ _id }, {
            $push:
            {
                participants: {
                    user: user,
                    role: 'troll'
                }
            }
        }, { new: true }); // mémo: new true pour retourner le document après update

        const roomUpdated = await getById(room._id);

        return roomUpdated;
    } catch (error) {
        throw error;
    }
}

const joinByName = async ({ name, user, password = '' }) => {
    try {
        // Check if the room exists
        let isExist = await Room.findOne({ name }).select('_id settings participants');
        if (!isExist) throw new CustomError('Room not found', 404);

        // Check if the room is password protected
        console.log('isExist.settings.password =>', isExist.settings.password);
        if (isExist.settings.password && !(await isExist.comparePassword(password)))
            throw new CustomError('Password is incorrect', 423);

        // Check if the room is full
        if (isExist.settings.max > 0 && isExist.settings.max === isExist.participants.length)
            throw new CustomError('Room is full', 400);

        // Check if the user is already in the room
        const isAlreadyIn = isExist.participants.some(participant => participant.user?.toString() === user._id.toString());
        // if (isAlreadyIn) throw new CustomError('User already in room', 400);
        console.log('isAlreadyIn =>', isAlreadyIn);

        if (!isAlreadyIn) {
            isExist = await Room.findOneAndUpdate(
                { _id: isExist._id },
                {
                    $push: {
                        participants: {
                            user: user._id,
                            role: 'troll'
                        }
                    }
                },
                { new: true } // Retourne la salle mise à jour
            ).populate('participants.user');
        }

        return isExist;
    } catch (error) {
        throw error;
    }
}

const joinByRandom = async (user) => {
    try {
        // Find a random room with no password or private settings false
        // It must be a random room, not the first one finding one

        const randomRoom = await Room.aggregate([
            {
                $match: {
                    $or: [
                        { "settings.max": 0 },
                        { $expr: { $gt: ["settings.max", { $size: "$participants" }] } }
                    ],
                    // check si password chaine de caractères vide
                    // "settings.password": { $exists: false },
                    "settings.is_private": false
                }
            },
            { $sample: { size: 1 } }
        ]);

        if (!randomRoom) throw new CustomError('No room found', 404);

        console.log('randomRoom =>', randomRoom);

        return randomRoom[0];
    } catch (error) {
        throw error;
    }
}




const remove = async (_id) => {
    try {
        const room = await Room.findOneAndDelete({ _id });
        if (!room) throw new CustomError('Room not found', 404);

        return room
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAll,
    getById,
    getByLimit,
    create,
    joinById,
    joinByName,
    joinByRandom,
    remove
};