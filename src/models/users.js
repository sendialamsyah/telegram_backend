const pool = require('../config/db')
const bcrypt = require('bcryptjs')
const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
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

const createUser = ({
  id,
  name,
  email,
  password
}) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO users(id, name, email, password)VALUES($1, $2, $3, $4)',
      [id, name, email, password],
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

const updateUser = ({
  name,
  email,
  image,
  id
}) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), image = COALESCE($3, image) WHERE id = $4',
      [
        name,
        email,
        image,
        id
      ],
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
const getUsers = (id) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users where id <> $1', [id], (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

const detailUser = (id) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users WHERE id = $1', [id], (err, result) => {
      if (!err) {
        resolve(result)
      } else {
        reject(new Error(err))
      }
    })
  })
}
module.exports = {
  findByEmail,
  createUser,
  updateUser,
  getUsers,
  detailUser
}