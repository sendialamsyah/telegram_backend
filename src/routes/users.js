const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const {protect} = require('../middlewares/auth')
const { register, login, refreshToken, updateProfile, getUsers, getProfile, detailUserById } = require('../controller/users')

router
  .get('/profile', protect, getProfile)
  .post('/register', register)
  .post('/login', login)
  .post('/refresh-token', refreshToken)
  .put('/:id', upload.single('image'), updateProfile)
  .get('/', protect, getUsers)
  .get('/:id', detailUserById)

module.exports = router