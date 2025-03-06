const Tag = require('../models/tags');
const CustomError = require('../utils/CustomError');
const slugify = require('../utils/slugify');

const create = async (name) => {
    try {
        const existingTag = await Tag.findOne({ name }).select('_id');
        if (existingTag) throw new CustomError('The tag already exists', 409);

        const newTag = new Tag({ name });
        await newTag.save();

        return newTag;
    } catch (error) {
        throw error
    }
}

const createTagsFromRoom = async function (tags) {
    try {
        if (tags.length === 0 || !tags) return null;

        // Remove duplicates from the tags array
        tags = [...new Set(tags.split(',').map(tag => tag.trim()))];

        const newTags = tags.map(tag => {
            return {
                'updateOne': {
                    'filter': { 'name': tag }, // Find the tag by its name
                    'update': { '$set': { 'slug': slugify(tag) } },
                    'upsert': true // If no document matches the filter, insert a new document
                }
            }
        });

        await Tag.bulkWrite(newTags);

        const allTags = await Tag.find({ name: { $in: tags.map(tag => tag) } }, '_id');

        console.log('All tags:', allTags);

        return allTags.map(tag => tag._id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    create,
    createTagsFromRoom
};