module.exports = (io, socket) => {
    console.log(`Socket ${socket.id} connecté à NotificationSockets`);

    socket.on("sendNotification", ({ userId, message }) => {
        io.to(userId).emit("newNotification", { message });
    });
};
