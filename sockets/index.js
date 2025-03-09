const roomSocket = require('./roomSocket');
const chatRoomSocket = require('./chatRoomSocket');
// const partySocket = require('./roomSocket');

module.exports = (io, socket) => {
    roomSocket(io, socket);
    chatRoomSocket(io, socket);
    // partySocket(io, socket);
};