const Spell = require("../models/spells");

const addSpell = async (req, res, next) => {
    try {
        const { name, description, image, category, races, levels} = req.body;

        let spell = await Spell.findOne({ name });
        if (spell) throw { statusCode: 400, message: "Ce sort existe déjà" };

        spell = new Spell({
            name,
            description,
            image,
            category,
            races,
            levels,
        });

        await spell.save();

        res.status(201).json({ success: true, message: "Spell créé avec succès", spell});
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const getSpell = async (req, res, next) => {
    try {
        const {_id } = req.params;

        let spell = await Spell.findById({_id});
        if (!spell) throw {statusCode: 400, message: "Ce sort n'est pas utilisable"};

        res.status(201).json({ success: true, message: "Spell invoqué avec succès", spell})

    } catch (error) {
        next(error);
    }
};

const getSpellByRace = async (req, res, next) => {
    try {
        const { races } = req.params;

        let spell = await Spell.find({ races });
        if (!spell) throw {statusCode: 400, message: "Ce sort n'est pas utilisable"};

        res.status(201).json({ success: true, message: "Spell invoqué avec succès", races})

    } catch (error) {
        next(error);
    }
};

module.exports = {
    addSpell,
    getSpell,
    getSpellByRace,
};