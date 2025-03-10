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

const modifyProfileService = async (data) => {
    
    try {
        const newUserData = data;
        // const user = await User.findById(userId);
        console.log('service, from controller :', newUserData)
        if (newUserData/*.username*/ !== /*req.user.username*/ 'Ale' && newUserData.length>1){
        
       await /*req.user*/ User.updateOne({_id: /*req.user*/ '67cb1ff9c81c81cb09c00718'} , 
                                         {username : newUserData/*.username*/} )
            let user = await User.findById(/*req.user*/ '67cb1ff9c81c81cb09c00718')
  
      console.log('Username updated successfully (end of service, just before return in controller):', user.username);
      return user.username;}{
        return console.error('already the username')
        
      }
    } catch (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  };

module.exports = { isUserInRoom, modifyProfileService };