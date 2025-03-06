const Party = require('../models/parties')
const User = require("../models/users");
const PartySession = require("../models/parties_session");

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

        const minimumPlayers = party.game.min; 
        const maximumPlayers = party.game.max; 
        const currentPlayers = party.participants.length;

        
        if (currentPlayers >= maximumPlayers) {

            const turnOrder = party.participants.map(p => p.user);
            const newSession = new PartySession({
                party: party._id,
                status: "in_progress",
                turn_number: 1,
                current_turn: turnOrder[0], 
                turn_order: turnOrder,
                actions: [],
            });

            await newSession.save();

            return res.status(201).json({ success: true, session: newSession });
        } else if (currentPlayers >= minimumPlayers) {

            setTimeout(async () => {
                const turnOrder = party.participants.map(p => p.user);
                const newSession = new PartySession({
                    party: party._id,
                    status: "in_progress",
                    turn_number: 1,
                    current_turn: turnOrder[0], 
                    turn_order: turnOrder,
                    actions: [],
                });

                await newSession.save();

                return res.status(201).json({ success: true, session: newSession });
            }, 30000); 

            return res.status(200).json({ success: true, message: `Waiting for more players... Session will start in 30 seconds.` });
        }

       
        return res.status(400).json({ success: false, message: `Not enough players to start the session.` });

    } catch (error) {
        next(error);
    }
};


module.exports = { 
    startParty
 };
