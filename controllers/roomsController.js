const roomModel = require('../models/roomModel')
const createError = require('http-errors')
const { v4: uuidv4 } = require('uuid')
const { response, notFoundRes } = require('../helper/common')
const cloudinary = require('../config/cloudinaryConfig')

const errorServer = new createError.InternalServerError()

const createRoom = async (req, res, next) => {
  const admin = req.decoded.id
  const { roomName, roomDescription } = req.body
  let roomImg

  console.log(req.file)

  const data = {
    roomId: uuidv4(),
    roomName,
    admin,
    roomDescription,
    roomImg
  }

  try {
    // Upload Photo single ke Cloudinary
    console.log(req.file.path)
    if (req.file) {
      roomImg = req.file.path

      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(roomImg, { folder: 'chatopia/room' }, function (error, result) {
          if (result) {
            resolve(result.url)
          } else if (error) {
            reject(error)
          }
        })
      })

      data.roomImg = url
    } else {
      console.log('create room without add room img')
    }

    await roomModel.createRoom(data)

    response(res, data, 201, 'room successfully created')
  } catch (error) {
    console.log(error)
    next(errorServer)
  }
}

module.exports = {
  createRoom
}
