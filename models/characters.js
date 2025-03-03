const mongoose = require('mongoose');
const Caracteristic = require('./caracteristics');

const characterSchema = new mongoose.Schema({
    // Identifiant unique du personnage
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },

    // Référence à l'utilisateur propriétaire du personnage
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true
    },

    // Référence à la race du personnage
    race: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'races',
        required: true,
        index: true
    },

    // Pseudo du personnage, par défaut identique au `username` de l'utilisateur
    pseudo: {
        type: String,
        default: function () { return this.user.username; },
        index: true
    },

    // URL ou chemin vers l'image de l'avatar du personnage
    avatar: {
        type: String,
        default: null,
    },

    // Genre du personnage (obligatoire)
    gender: {
        type: String,
        enum: ['female', 'male', 'non-binary'],
        required: true,
        default: 'non-binary',
    },
}, { timestamps: true });

characterSchema.post('save', async function (doc, next) {
    // here doc is the character saved document
    // in a pre middleware, doc won't be available because the save doesn't happen yet
    // in a post middleware, doc is available because the save has happened
    // so use this in a pre middleware but afterall, the case is not the same.
    // also, remember that this is not available in an anonymous arrow function
    try {
        // create the caracteristics for the character
        // no need to add the other fields like 'strength', 'intelligence', etc because they have default values
        const newCaracteristic = await Caracteristic.create({ character: doc._id });
        // update the character with the caracteristic 
        // this way to have access to the caracteristic document reference saved in the character
        // after the save done in the controller
        await Character.findByIdAndUpdate(doc._id, { caracteristics: newCaracteristic._id });
        
        next();
    } catch (error) {
        next(error);
    }
});


const Character = mongoose.model('characters', characterSchema);

module.exports = Character;