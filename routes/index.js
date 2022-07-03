const express = require('express')
const router = express.Router()
const usersRouters = require('./usersRouters')

router
  .use('/users', usersRouters)

module.exports = router
