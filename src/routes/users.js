const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const {protect} = require('../middlewares/auth')
const { register, login, refreshToken, updateProfile, getUsers, detailUserById } = require('../controller/users')

router
//   .get('/profil', protect, getProfil)
  .post('/register', register)
  .post('/login', login)
  .post('/refresh-token', refreshToken)
  .put('/:iduser', upload.single('image'), updateProfile)
  .get('/', protect, getUsers)
  .get('/:iduser', detailUserById)

module.exports = router