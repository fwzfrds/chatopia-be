const messageModel = require('../models/messageModel')
const createError = require('http-errors')
const { v4: uuidv4 } = require('uuid')
const { response, notFoundRes } = require('../helper/common')
const cloudinary = require('../config/cloudinaryConfig')

const errorServer = new createError.InternalServerError()

const sendMessage = async (req, res, next) => {
  const idSender = req.decoded.id
  const { message, idReceiver } = req.body
  let messageImg

  console.log(req.file)

  const messageData = {
    messageId: uuidv4(),
    idSender,
    idReceiver,
    message,
    messageImg
  }

  try {
    // Upload Photo single ke Cloudinary
    if (req.file) {
      console.log(req.file.path)
      messageImg = req.file.path

      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(messageImg, { folder: 'chatopia/message' }, function (error, result) {
          if (result) {
            resolve(result.url)
          } else if (error) {
            reject(error)
          }
        })
      })

      messageData.messageImg = url
    } else {
      console.log('send message without add img')
    }

    await messageModel.sendMessage(messageData)

    response(res, messageData, 201, 'Message sent')
  } catch (error) {
    console.log(error)
    next(errorServer)
  }
}

const getMessage = async (req, res, next) => {
  const idSender = `${req.decoded.id}`
  const { idReceiver } = req.body

  try {
    const { rows } = await messageModel.getMessage(idSender, `${idReceiver}`)
    console.log(rows)
    if (rows.length === 0) {
      return notFoundRes(res, 404, 'Message with this account is empty')
    }

    response(res, rows, 200, 'Get message success')
  } catch (error) {
    console.log(error)
    next(errorServer)
  }
}

module.exports = {
  sendMessage,
  getMessage
}
