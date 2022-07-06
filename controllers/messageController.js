const messageModel = require('../models/messageModel')
const createError = require('http-errors')
const { v4: uuidv4 } = require('uuid')
const { response, notFoundRes } = require('../helper/common')
const cloudinary = require('../config/cloudinaryConfig')

const errorServer = new createError.InternalServerError()

const sendMessage = async (req, res, next) => {
  const id_sender = req.decoded.id
  const { message, id_receiver } = req.body
  let message_img

  console.log(req.file)

  const messageData = {
    message_id: uuidv4(),
    id_sender,
    id_receiver,
    message,
    message_img
  }

  try {
    // Upload Photo single ke Cloudinary
    if (req.file) {
      console.log(req.file.path)
      message_img = req.file.path

      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(message_img, { folder: 'chatopia/message' }, function (error, result) {
          if (result) {
            resolve(result.url)
          } else if (error) {
            reject(error)
          }
        })
      })

      messageData.message_img = url
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
  const idSender = `${req.decoded.email}`
  const idReceiver = req.params.receiverId
  console.log(`sender: ${idSender}`)
  console.log(`receiver: ${idReceiver}`)
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
