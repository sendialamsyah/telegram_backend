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
  iduser,
  name,
  email,
  password
}) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO users(iduser, name, email, password)VALUES($1, $2, $3, $4)',
      [iduser, name, email, password],
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
  iduser
}) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), image = COALESCE($3, image) WHERE iduser = $4',
      [
        name,
        email,
        image,
        iduser
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
const getUsers = (iduser) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users where iduser <> $1', [iduser], (error, result) => {
      if (!error) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })
}

const detailUser = (iduser) => {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM users WHERE iduser = $1', [iduser], (err, result) => {
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