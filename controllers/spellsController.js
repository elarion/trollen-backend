const Spell = require("../models/spells");

const addSpell = async (req, res, next) => {
    try {
        const { name, description, image, category, races, levels} = req.body;

        let spell = await Spell.findOne({ spell });
        if (spell) throw { statusCode: 400, message: "Ce sort existe déjà" };

        spell = new Spell({
            name,
            description,
            image,
            category,
            races,
            levels
        });

        await spell.save();

        res.status(201).json({ success: true, message: "Spell créé avec succès", spell});
    } catch (error) {
        next(error);
    }
};

const getSpell = async (req, res, next) => {
    try {
        const {_id } = req.body;

        let spell = await Spell.findById({ _id });
        if (!spell) throw {statusCode: 400, message: "Ce sort n'est pas utilisable"};

        res.status(201).json({ success: true, message: "Spell invoqué avec succès", spell})

    } catch (error) {
        next(error);
    }
};

module.exports = {
    addSpell,
    getSpell,
};