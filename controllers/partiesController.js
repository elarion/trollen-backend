const Party = require('../models/parties')
const User = require("../models/users");
const PartySession = require("../models/parties_session");
const Game = require("../models/games");
const uid2 = require("uid2");
const crypto = require('crypto');


//affiche toutes les parties avec le nombre de participants, le jeu et le statut de la partie
const allParties = async (req, res, next) => {
    try {
        const parties = await Party.find()
            .select('_id party_socket_id name game participants createdAt')
            .populate([
                { path: 'game', select: 'name' },
                { path: "participants.user", select: "username" }
            ]);
        for (let party of parties) {
            const playerOnline = party.participants.filter(participant => participant.status === 'online').length;
            const partySession = await PartySession.findOne
                ({ party: party._id }).select("status")
            party.playerOnline = playerOnline;
            party.partyStatus = partySession?.status;
        }
        res.status(200).json({ success: true, parties });
    } catch (error) {
        next(error);
    }
};
//Recherche d'une partie par son id
const partyById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const party = await Party.findById(id)
            .populate([
                { path: 'game', select: 'name' },
                { path: "participants.user", select: "username" },
                { path: "admin", select: "username" }
            ]);
        if (!party) {
            throw { statusCode: 404, message: "Party not found" };
        }
        const partySession = await PartySession.findOne({ party: party._id })
            .select("status turn_number current_turn turn_order");

        party.status = partySession?.status || 'waiting';
        party.turnNumber = partySession?.turn_number || 1;
        party.currentTurn = partySession?.current_turn || null;
        party.turnOrder = partySession?.turn_order || [];

        res.status(200).json({ success: true, party });
    } catch (error) {
        next(error);
    }

}

const joinPartyByJoinId = async (req, res, next) => {
    const user = req.user;
    const { join_id, password } = req.body;

    try {
        const party = await Party.findOne({ join_id }).populate([{ path: 'participants', select: 'user' }, { path: 'game', select: '_id min max' }]);
        if (!party) throw new CustomError("Party not found", 404);
        if (party.max && party.participants.length >= party.game.max) throw new CustomError('Party is full', 401);

        const userAlreadyInParty = party.participants.some(participant => participant.user.toString() === user._id.toString());
        if (userAlreadyInParty) throw new CustomError('User already in this party', 401);

        const updatedParty = await Party.findByIdAndUpdate(
            party._id,
            { $push: { participants: { user: user._id, role: 'troll' } } },
            { new: true }
        );

        // Checker si le nombre minimun de joueur est atteint mais non, en fait on va check si la party est en cours
        const isMinPlayersReached = party.game.min && updatedParty.participants.length >= party.game.min;

        if (!updatedParty) throw new CustomError('Failed to update party', 500);

        res.status(200).json({ success: true, party: updatedParty, isMinPlayersReached });
    } catch (error) {
        next(error);
    }
};

// Create a route that delete a user from a party

// Création d'une partie
const createParty = async (req, res, next) => {
    const generateNumericId = (length) => Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

    try {
        const user = req.user;

        const { name, game } = req.body

        if (!name || !game || !user) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const populatedUser = await User.findById(user).select('username');
        if (!populatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const gameData = await Game.findOne({ name: game }).select('_id');
        if (!gameData) {
            return res.status(404).json({ success: false, message: 'Game not found' });
        }
        const username = populatedUser.username;

        const newParty = new Party({
            name,
            game: gameData._id,
            join_id: `${username}#${generateNumericId(5)}`,
            admin: user,
            participants: [{
                user: user,
                role: 'gamemaster',
                status: 'online'
            }],
        });

        await newParty.save();

        res.status(201).json({ success: true, party: newParty });

    } catch (error) {
        next(error);
    }
};

//matchmaking
const joinParty = async (req, res, next) => {
    const user = req.user;
    const { games } = req.body;

    // games du boddy est un tableau de string
    try {
        const parties = await Party.find({
            game: { $in: games },
            // status: "waiting",
            'participants.user': { $ne: user }
        })
<<<<<<< HEAD
        .populate('game', 'min max')
            .populate('participants.user', 'username'); 
    
=======
            .populate('game', 'min max')
            .populate('participants.user', 'username');

>>>>>>> cdbf7a3e4653d38e3a17ddda90d5b7c97de1de7c
        let minMissingPlayers = null;
        let bestParty = null;

        for (let party of parties) {
            const userAlreadyInParty = party.participants.length;
            const minimumPlayers = party.game.min;
            const missingPlayers = minimumPlayers - userAlreadyInParty;

            if (missingPlayers <= 0) continue;

            if (minMissingPlayers === null || missingPlayers < minMissingPlayers) {
                minMissingPlayers = missingPlayers;
                bestParty = party;
            }
        }

        if (!bestParty) {
            return res.status(404).json({ success: false, message: "Aucune partie avec des places disponibles." });
        }

        bestParty.participants.push({
            user: user,
            role: 'troll',
            status: 'online'
        });

        await bestParty.save();

        res.status(200).json({ success: true, party: bestParty });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    allParties,
    partyById,
    joinPartyByJoinId,
    createParty,
    joinParty,
};