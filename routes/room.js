const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/room');

router.get("/", RoomController.createRoom)

module.exports = router