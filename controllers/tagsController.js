const Tag = require('../models/tags');
const slugify = require('../utils/slugify');

const createTagsFromRoom = async function (tags = []) {
    try {
        if (!tags) return next();

        const newTags = tags.map(tag => {
            return {
                'updateOne': {
                    'filter': { 'name': tag.name },
                    'update': { '$set': { 'slug': slugify(tag.name) } },
                    'upsert': true
                }
            }
        });

        await Tag.bulkWrite(newTags);

        const allTags = await Tag.find({ name: { $in: tags.map(tag => tag.name) } }, '_id');

        this.tags = allTags.map(tag => tag._id);

        return allTags.map(tag => tag._id);
    } catch (error) {
        console.error('error =>', error);
        throw new Error({ statusCode: 500, message: 'Error while creating tags', errors: error });
    }
};

module.exports = { createTagsFromRoom };