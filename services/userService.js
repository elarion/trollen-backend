const Room = require('../models/rooms');
const User = require('../models/users')

const isUserInRoom = async (roomId, userId) => {
	try {
		return await User.exists({ _id: userId, "rooms.room": roomId });
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