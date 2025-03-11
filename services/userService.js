const Room = require('../models/rooms');
const User = require('../models/users')

const isUserInRoom = async (roomId, userId) => {
	try {
		console.log('isUserinRoom =>', roomId, userId)
		// Find a room by its users in the subdoc participants of the Room model
		const room = await Room.findOne({ _id: roomId, participants: { $elemMatch: { user: userId } } }).select('_id');
		return room ? true : false;
	} catch (error) {
		throw error
	}
}

const modifyProfileService = async (data, user) => {

	try {
		const newUserData = data;

		console.log('service, from controller :', newUserData, user)

		if (newUserData === user.username || newUserData.length === 0) {
			throw new CustomError('Incorrect username', 400)
		}

		await User.updateOne({ _id: user._id }, { username: newUserData })

		let userUpdated = await User.findById(user._id);

		console.log('Username updated successfully (end of service, just before return in controller):', userUpdated.username);

		return userUpdated;

	} catch (error) {
		console.error('Error updating username:', error);
		throw error;
	}

}

module.exports = { isUserInRoom, modifyProfileService };