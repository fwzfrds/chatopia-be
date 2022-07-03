const pool = require('../db')

const createRoom = ({ roomId, roomName, admin, roomDescription, roomImg }) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO rooms(room_id, room_name, admin, room_description, room_img)VALUES($1, $2, $3, $4, $5)', [roomId, roomName, admin, roomDescription, roomImg], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

module.exports = {
  createRoom
}
