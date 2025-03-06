
const Game = require("../models/games");

const createGame = async (req, res) => {
    try {
        const { name, description, min, max, duration, turn_time_limit, use_spells } = req.body;

        if (!name || !description || min == null || max == null || duration == null) {
            return res.status(400).json({ message: 'Tous les champs requis doivent être remplis.' });
        }

        const existingGame = await Game.findOne({ name });
        if (existingGame) {
            return res.status(409).json({ message: 'Un jeu avec ce nom existe déjà.' });
        }

        const newGame = new Game({
            name,
            description,
            min,
            max,
            duration,
            turn_time_limit: turn_time_limit || 30, 
            use_spells: use_spells ?? true,
        });
        await newGame.save();
        res.status(201).json(newGame);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

const allGames = async (req, res, next) => {
    try {
        const games = await Game.find()
            .select('_id name description min max duration turn_time_limit use_spells')
        res.status(200).json({ success: true, games});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createGame,
    allGames
};