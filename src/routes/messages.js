const express = require('express')
const router = express.Router()
const {protect} = require('../middlewares/auth')
const {getMessage, deleteMessage} = require('../controller/messages')

router
    .get('/:receiver_id', protect, getMessage)
    .delete('/:id', deleteMessage)

module.exports = router
