const Tag = require('../models/tags');
const slugify = require('../utils/slugify');

const create = async (name) => {
    try {
        const existingTag = await Tag.findOne({ name }).select('_id');
        if (existingTag) throw { statusCode: 409, message: 'The tag already exists' }

        const newTag = new Tag({ name });
        await newTag.save();

        return newTag;
    } catch (error) {
        throw { statusCode: error.statusCode, message: error.message || 'Error while creating a tag' };
    }
}

const createTagsFromRoom = async function (tags = []) {
    try {
        if (tags.length === 0) return null;

        tags = tags.split(',').map(tag => ({ name: tag.trim() }));

        const newTags = tags.map(tag => {
            return {
                'updateOne': {
                    'filter': { 'name': tag.name },
                    'update': { '$set': { 'slug': slugify(tag.name) } },
                    'upsert': true // If no document matches the filter, insert a new document
                }
            }
        });

        await Tag.bulkWrite(newTags);

        const allTags = await Tag.find({ name: { $in: tags.map(tag => tag.name) } }, '_id');

        return allTags.map(tag => tag._id);
    } catch (error) {
        throw { statusCode: 500, message: 'Error while creating tags from room creation service', errors: error };
    }
}

module.exports = {
    create,
    createTagsFromRoom
};