const Tag = require('../models/tags');
const slugify = require('../utils/slugify');

const createTagsFromRoomPreSave = async (doc, next) => {
    const { tags } = doc;

    try {
        if (!tags) return next();

        const newTags = tags.map(tag => {
            const slug = slugify(tag.name);
            return {
                'updateOne': {
                    'filter': { 'name': tag.name },
                    'update': { '$set': { 'slug': slug } },
                    'upsert': true
                }
            }
        });

        await Tag.bulkWrite(newTags);

        const tags = await Tag.find({ name: { $in: tags.map(tag => tag.name) } }, '_id');
        doc.tags = tags;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { createTagsFromRoomPreSave };