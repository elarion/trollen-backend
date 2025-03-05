const Room = require('../models/rooms');
const { createTagsFromRoom } = require('../services/tagService');

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
        throw { statusCode: error.statusCode, message: error.message || 'Error while getting all rooms' };
    }
};

const getById = async (id) => {
    try {
        const room = await Room.findById(id)
            .select('_id room_socket_id name user tags settings participants')
            .populate([
                { path: 'tags', select: '_id name slug' },
                { path: 'admin', select: '_id username' },
                { path: 'participants.user', select: '_id username' }
            ]);

        if (!room) throw { statusCode: 404, message: 'Room not found' };

        return room;
    } catch (error) {
        throw { statusCode: error.statusCode, message: error.message || 'Error while getting room by id' };
    }
}

const create = async (data) => {
    const { user, room_socket_id, name, tags, settings = {} } = data;

    try {
        // a mettre après la création de la room comme ça si fail de la save de la room, les tags ne sont pas créés
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
        throw { statusCode: error.statusCode, message: error.message || 'Error while creating a room' };
    }
}

const join = async ({ _id, user }) => {
    console.log('in join =>', _id, user);
    try {
        const isExist = await Room.findById(_id).select('_id settings participants');

        if (!isExist) throw { statusCode: 404, message: 'Room not found' };

        const isAlreadyIn = isExist.participants.some(participant => participant.user.toString() === user);
        if (isAlreadyIn) throw { statusCode: 400, message: 'User already in room' };
        if (isExist.settings.max === isExist.participants.length) throw { statusCode: 400, message: 'Room is full' };


        const room = await Room.updateOne({ _id }, {
            $push:
            {
                participants: {
                    user: user,
                    role: 'troll'
                }
            }
        }, { new: true }); // new: true pour retourner le document après update

        return room
    } catch (error) {
        throw { statusCode: error.statusCode, message: error.message || 'Error while joining a room' };
    }
}

const remove = async (_id) => {
    try {
        const room = await Room.findOneAndDelete({ _id });
        if (!room) throw { statusCode: 404, message: 'Room not found' };

        return room
    } catch (error) {
        throw { statusCode: error.statusCode, message: error.message || 'Error while deleting a room' };
    }
}

module.exports = {
    getAll,
    getById,
    create,
    join,
    remove
};