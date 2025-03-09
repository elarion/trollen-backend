const express = require("express");
const router = express.Router();
const { roomValidationRules } = require("../validators/roomValidator");
const roomsController = require("../controllers/roomsController");
const validateRequest = require("../middlewares/validationRequest");
const errorHandler = require("../middlewares/errorHandler");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/", authenticateToken, roomsController.getAllRooms); // Get all rooms
router.get("/by-limit", roomsController.getRoomsByLimit); // Get rooms with limit for lazy loading
router.get("/by-id/:id", roomsController.getRoomById); // Get room by id
router.get("/by-name/:name", roomsController.getRoomByName); // Get room by id
router.post("/create", roomValidationRules(), validateRequest, roomsController.createRoom); // Create room
router.put("/join-by-id/:id", roomsController.joinRoomById); // Join a room
router.put("/join-by-name/:name", authenticateToken, roomsController.joinRoomByName); // Join a room
router.delete("/:id", roomsController.deleteRoom); // Delete room

router.use(errorHandler);

module.exports = router;