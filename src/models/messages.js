const pool = require('../config/db')

const create = ({
    message,
    senderId,
    receiverId
  }) => {
    return new Promise((resolve, reject) => {
      pool.query(
        'INSERT INTO messages(message, senderId, receiverId)VALUES($1, $2, $3)',
        [message, senderId, receiverId],
        (err, result) => {
          if (!err) {
            resolve(result)
          } else {
            reject(new Error(err))
          }
        }
      )
    })
  }
const getMessage = (senderId, receiverId) =>{
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM messages where (senderId = '${senderId}' AND receiverId = '${receiverId}') OR (senderId = '${receiverId}' AND receiverId = '${senderId}') ORDER BY createdAt ASC`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}
  module.exports = {
    create,
    getMessage
  }