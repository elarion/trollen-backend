const Race = require('../models/races')


const allRaces = async (req, res, next) => {
    try {
        const races = await Race.find()
        .populate('spells');
        if (races && races.length > 0) {
            res.status(200).json({ success: true, races });
        } else {
            res.status(404).json({ success: false, message: 'Aucune race trouvée' });
        } 
    } catch (error) {
        next(error);
    }
}
const getRaceByName = async (req, res, next) => {
    try {
       const {name} = req.params
        const race = await Race.findOne({name})
        .populate('spells');
        if (race) {
            res.status(200).json({ success: true, race });
        } else {
            res.status(404).json({ success: false, message: 'Aucune race trouvée' });
        } 
    } catch (error) {
        next(error);
    }
}
module.exports = {
    allRaces,
    getRaceByName,
};