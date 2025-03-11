const express = require("express");
const router = express.Router();
const { roomValidationRules } = require("../validators/roomValidator");
const roomsController = require("../controllers/roomsController");
const validateRequest = require("../middlewares/validationRequest");
const errorHandler = require("../middlewares/errorHandler");
const authenticateToken = require("../middlewares/authenticateToken");

router.get("/", authenticateToken, roomsController.getAllRooms); // Get all rooms
router.get("/by-limit", authenticateToken, roomsController.getRoomsByLimit); // Get rooms with limit for lazy loading
router.get("/by-id/:id", authenticateToken, roomsController.getRoomById); // Get room by id
router.get("/by-name/:name", authenticateToken, roomsController.getRoomByName); // Get room by id
router.post("/create", authenticateToken, roomValidationRules(), validateRequest, roomsController.createRoom); // Create room
router.put("/join-by-id/:id", authenticateToken, roomsController.joinRoomById); // Join a room
router.put("/join-by-name/:name", authenticateToken, roomsController.joinRoomByName); // Join a room
router.delete("/:id", authenticateToken, roomsController.deleteRoom); // Delete room

router.use(errorHandler);


module.exports = router;