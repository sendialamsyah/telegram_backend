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
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())
helmet({
  crossOriginResourcePolicy: false
})
app.use(xss())
app.disable('x-powered-by')

app.use('/v1', mainRouter)
app.use('/image', express.static(path.join(__dirname, './upload')))


const PORT = process.env.PORT || 6000

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

const http = require('http')
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors:{
    //   credentials: true,
      origin: 'https://telegram-chat.vercel.app'
  }
})

io.use((socket, next)=>{
  const token = socket.handshake.query.token
  jwt.verify(token, process.env.SECRET_KEY_JWT, function(error, decoded) {
      if(error){
          if(error && error.name === 'JsonWebTokenError'){
              next(createError(400, 'token invalid'))
          }else if(error && error.name === 'TokenExpiredError'){
              next(createError(400, 'token expired'))
          }else{
              next(createError(400, 'Token not active'))
          }
      }
  
      socket.userId = decoded.id
      socket.join(decoded.id)
      next()
  });
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
          receiver_id:idReceiver ,
          message:messageBody,
          sender_id: socket.userId,
          date: new Date()
      }
      console.log(message);
      callback({...message, date: moment(message.date).format('LT')})
      messageModel.create(message)
      .then(()=>{
          socket.broadcast.to(idReceiver).emit('newMessage', {
            ...message, date: moment(message.date).format('LT')
          })
      })
      // console.log('roomSender', room);
      // io.to(`room:${room}`).emit('newMessage', {
      //     sender: sender,
      //     message: message,
      //     date: new Date().getHours()+':'+ new Date().getMinutes()
      // })
  })

  // socket.on('message', ({idSocket, message})=>{
  //     // socket.emit('messageBE', {message: data, date: new Date()})
  //     // socket.broadcast.emit('messageBE', {message: data, date: new Date()})
  //     // io.emit('messageBE', {message: data, date: new Date()})
  //     socket.to(idSocket).emit('messageBE', {message: message, date: new Date()})
  // })
  socket.on('disconnect', ()=>{
      console.log(`ada perangkat yg terputus dengan id ${socket.id}`);
      // userModel.deleteUserbyId()
  })
})

httpServer.listen(PORT, ()=>{
  console.log(`server is running in port ${PORT}`);
})