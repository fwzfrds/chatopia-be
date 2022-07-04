const pool = require('../db')

const sendRoomMessage = ({ messageId, idRoom, idSender, message, messageImg }) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO room_messages(message_id, id_room, id_sender, message, message_img)VALUES($1, $2, $3, $4, $5)', [messageId, idRoom, idSender, message, messageImg], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

module.exports = {
  sendRoomMessage
}
