const express = require('express')
const { sendMessage, getMessage } = require('../controllers/messageController')
const router = express.Router()
const { protect, isUser } = require('../middlewares/authMiddleware')
const uploadPhoto = require('../middlewares/uploadPhoto')

router
  .post('/send', protect, isUser, uploadPhoto.single('message_img'), sendMessage)
  .get('/get', protect, isUser, getMessage)

module.exports = router
