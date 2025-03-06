const Party = require('../models/parties')
const User = require("../models/users");
const PartySession = require("../models/parties_session");

//Creation de la partySession au start du gamemaster
const startParty = async (req, res, next) => {
    try {
        const { id } = req.params;
        const party = await Party.findById(id);

        if (!party) {
            return res.status(404).json({ success: false, message: "Party not found" });
        }
        const existingSession = await PartySession.findOne({ party: id });
        if (existingSession) {
            return res.status(400).json({ success: false, message: "Session already started" });
        }

        const turnOrder = party.participants.map(p => p.user);

        const newSession = new PartySession({
            party: id,
            status: "in_progress",
            turn_number: 1,
            current_turn: turnOrder[0], 
            turn_order: turnOrder,
            actions: [],
        });

        await newSession.save();

        res.status(201).json({ success: true, session: newSession });

    } catch (error) {
        next(error);
    }
};

module.exports = { 
    startParty

 };
