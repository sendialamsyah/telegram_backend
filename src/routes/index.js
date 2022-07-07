const express = require('express')
const Router = express.Router()

const authRouter = require('./users')
const messagesRoute = require('./messages')

Router
    .use('/user', authRouter)
    .use('/message', messagesRoute)

module.exports = Router