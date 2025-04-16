const roomSocket = require('./roomSocket');
const chatRoomSocket = require('./chatRoomSocket');
const positionSocket = require('./positionSocket');
// const partySocket = require('./roomSocket');

module.exports = (io, socket) => {
    roomSocket(io, socket);
    chatRoomSocket(io, socket);
    positionSocket(io, socket);
    // partySocket(io, socket);
};