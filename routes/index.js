const express = require('express')
const router = express.Router()
const usersRouters = require('./usersRouters')
const roomRouters = require('./roomRouters')
const messageRouters = require('./messageRouters')

router
  .use('/users', usersRouters)
  .use('/rooms', roomRouters)
  .use('/message', messageRouters)

module.exports = router
