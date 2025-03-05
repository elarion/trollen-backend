const Parties = require('../models/parties')
const User = require("../models/users");
const PartySession = require("../models/party_sessions");
//affiche toutes les parties avec le nombre de participants, le jeu et le statut de la partie
const allParties = async (req, res, next) => {
    try {
        const parties = await Parties.find()
            .select('_id party_socket_id name game participants')
            .populate([
                { path: 'game', select: 'name' },
                { path: "participants.user", select: "username" } 
            ]);
            for (let party of parties) {
            const playerOnline = party.participants.filter(participant => participant.status === 'online').length;
            const partySession = await PartySession.findOne
            ({ party: party._id }).select("status")
            party.playerOnline = playerOnline;
            party.isWaiting = partySession ?.status;
            }
        res.status(200).json({ success: true, parties});
    } catch (error) {
        next(error);
    }
};


module.exports = {
    allParties
};