const pool = require('../config/db')


const create = ({sender_id, receiver_id, message}) => {
  return new Promise((resolve, reject) => {
    pool.query('INSERT INTO messages(sender_id, receiver_id, message)VALUES($1, $2, $3)', [sender_id, receiver_id, message], (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}
const getMessage=(sender_id, receiver_id)=>{
  // console.log(sender_id);
  // console.log(receiver_id);
  return new Promise((resolve, reject) => {
    pool.query(`SELECT id, message, sender_id, receiver_id, to_char(created_at, 'HH24:MI') as date FROM messages where (sender_id = '${sender_id}' AND receiver_id = '${receiver_id}') OR (sender_id = '${receiver_id}' AND receiver_id = '${sender_id}') ORDER BY created_at ASC`, (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

const delMessage=(id)=>{
  return new Promise((resolve, reject)=>{
    pool.query('DELETE FROM messages WHERE id = $1', [id], (error, result)=>{
      if(!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}
module.exports = {
  create,
  getMessage,
  delMessage
}
