const express = require('express')
const Router = express.Router()

const authRouter = require('./users')
const messagesRoute = require('./messages')

Router
    .use('/users', authRouter)
    .use('/messages', messagesRoute)

module.exports = Router