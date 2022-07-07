require('dotenv').config()
const express = require('express')
const {Server} = require('socket.io')
const helmet = require('helmet')
const xss = require('xss-clean')
const CreateError = require('http-errors')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const mainRouter = require('./src/routes/index')
const jwt = require('jsonwebtoken')
const moment = require('moment')
moment.locale('id')
const messageModel = require('./src/models/messages')

const app = express()
const http = require('http')
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors:{
      origin: 'http://localhost:3000'
  }
})
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
helmet({
  crossOriginResourcePolicy: false
})
app.use(xss())
app.disable('x-powered-by')

app.use('/v1', mainRouter)
app.use('/video', express.static(path.join(__dirname, './upload')))

io.use((socket, next)=>{
  const token = socket.handshake.query.token
  jwt.verify(token, process.env.SECRET_KEY_JWT, function(error, decoded){
    if(error){
      if (error && error.name === 'JsonWebTokenError') {
        next(createError(400, 'token invalid'))
      } else if (error && error.name === 'TokenExpiredError') {
        next(createError(400, 'token expired'))
      } else {
        next(createError(400, 'token not active'))
      }
    }
    socket.userId = decoded.iduser
    socket.join(decoded.id)
    next()
    
  })
})
io.on('connection', (socket)=>{
  console.log(`ada perankat yg terhubung dengan id ${socket.id} dan id usernya ${socket.userId}`);
  socket.on('inisialRoom', ({room, username})=>{
    console.log(room);
    socket.join(`room:${room}`)
    // socket.broadcast.t
    socket.broadcast.to(`room:${room}`).emit('notifAdmin', {
        sender: 'Admin',
        message: `${username} bergabung dalam group`,
        date: new Date().getHours()+':'+ new Date().getMinutes()
    })
})
socket.on('sendMessage', ({idReceiver, messageBody}, callback)=>{
  const message = {
    receiverId: idReceiver,
    message: messageBody,
    senderId: socket.userId,
    createdAt: new Date()
  }
  console.log(message)
  callback({...message, createdAt: moment(message.createdAt).format('LT')})
  messageModel.create(message)
  .then(()=>{
    socket.broadcast.to(idReceiver).emit('newMessage', message)
  })
})
  socket.on('disconnect', ()=>{
      console.log(`ada perangkat yg terputus dengan id ${socket.id}`);
  })
})
const PORT = process.env.PORT || 6000
httpServer.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`)
})
app.all('*', (req, res, next) => {
  next(new CreateError.NotFound())
})

app.use((err, req, res, next) => {
  const messError = err.message || 'internal server error'
  const statusCode = err.status || 500

  res.status(statusCode).json({
    message: messError
  })
})
