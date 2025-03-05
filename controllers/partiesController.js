const Parties = require('../models/parties')
const User = require("../models/users");
const PartySession = require("../models/party_sessions");
//affiche toutes les parties avec le nombre de participants, le jeu et le statut de la partie
const allParties = async (req, res, next) => {
    try {
        const parties = await Parties.find()
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
            party.partyStatus = partySession ?.status;
            }
        res.status(200).json({ success: true, parties});
    } catch (error) {
        next(error);
    }
};
//Recherche d'une partie par son id
const partyById = async (req,res,next) => {
    try {
        const {id} = req.params;
        const party = await Parties.findById(id)
        .populate([
            {path: 'game', select: 'name'},
            { path: "participants.user", select: "username" } 
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


module.exports = {
    allParties,
    PartyById
};