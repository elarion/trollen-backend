const mongoose = require('mongoose');
const UserReport = require('../models/users_reports');
const User = require('../models/users');

const reportUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason, description } = req.body;
        const reporter = req.user._id;
        
        const reported = id;

        if (!mongoose.Types.ObjectId.isValid(reported)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        if (!reason || !description) {
            return res.status(400).json({ success: false, message: "Reason and description are required" });
        }

        if (reporter === reported) {
            return res.status(400).json({ success: false, message: "You cannot report yourself" });
        }

        const user = await User.findById(reported);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const existingReport = await UserReport.findOne({ reporter, reported, reason });
        if (existingReport) {
            return res.status(400).json({ success: false, message: "You have already reported this user for this reason" });
        }

        const newReport = new UserReport({
            reporter,
            reported,
            reason,
            description,
        });

        await newReport.save();
        return res.status(201).json({ success: true, report: newReport });

    } catch (error) {    
        console.error("Error in reportUser:", error);
        next(error);
    }
};

module.exports = { reportUser };
