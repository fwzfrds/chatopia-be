const pool = require('../db')

const sendMessage = ({ messageId, idSender, idReceiver, message, messageImg }) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO messages(message_id, id_sender, id_receiver, message, message_img)VALUES($1, $2, $3, $4, $5)', [messageId, idSender, idReceiver, message, messageImg], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const getMessage = (idSender, idReceiver) => {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM messages WHERE id_sender = '${idSender}' AND id_receiver = '${idReceiver}'`, (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

module.exports = {
  sendMessage,
  getMessage
}
