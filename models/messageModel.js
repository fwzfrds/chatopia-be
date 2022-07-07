const pool = require('../db')

const sendMessage = ({ message_id, id_sender, id_receiver, message, message_img }) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO messages(message_id, id_sender, id_receiver, message, message_img)VALUES($1, $2, $3, $4, $5)', [message_id, id_sender, id_receiver, message, message_img], (err, result) => {
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
    pool.query(`SELECT * FROM messages WHERE (id_sender = '${idSender}' AND id_receiver = '${idReceiver}') OR (id_sender = '${idReceiver}' AND id_receiver = '${idSender}')`, (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}

const delMessage = (message_id) => {
  return pool.query('DELETE FROM messages WHERE message_id = $1', [message_id])
}

module.exports = {
  sendMessage,
  getMessage,
  delMessage
}
