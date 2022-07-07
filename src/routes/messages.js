const express = require('express')
const router = express.Router()
const {protect} = require('../middlewares/auth')
const {getMessage} = require('../controller/messages')

router
    .get('/:receiverId', protect, getMessage)

module.exports = router
