const UserFriend = require('../models/users_friends')

const add = async ({user_1, user_2}) => {
    const friend = await UserFriend.findOne({$or : [{user_1 , user_2}, {user_1 : user_2, user_2 : user_1}]});
    // Checker en BDD si y'a pas déjà cette amitié, or 
    // UserFriend.findOne({$or : [{user_1 , user_2}, {user_1 : user_2, user_2 : user_1}])
    // On peut enregister la friendship
    const newFriend = new UserFriend({
        user_1,
        user_2
    })
    await newFriend.save();
}

module.exports = {
    add
}