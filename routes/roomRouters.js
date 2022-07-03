const express = require('express')
const { createRoom } = require('../controllers/roomsController')
const router = express.Router()
const { protect, isUser } = require('../middlewares/authMiddleware')
const uploadPhoto = require('../middlewares/uploadPhoto')

router
  .post('/create', protect, isUser, uploadPhoto.single('img'), createRoom)

module.exports = router
