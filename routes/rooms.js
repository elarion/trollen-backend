const express = require("express");
const router = express.Router();
const { roomValidationRules } = require("../validators/roomValidator");
const {
    getAllRooms,
    createRoom,
    getRoomById,
    deleteRoom,
    joinRoom
} = require("../controllers/roomsController");
const validateRequest = require("../middlewares/validationRequest");
const errorHandler = require("../middlewares/errorHandler");


router.get("/", getAllRooms); // Get all rooms
router.get("/:id", getRoomById); // Get room by id
router.post("/create", roomValidationRules(), validateRequest, createRoom); // Create room
router.put("/join/:id", joinRoom); // Join a room
router.delete("/:id", deleteRoom); // Delete room

router.use(errorHandler);

module.exports = router;