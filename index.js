require('dotenv').config()

const express = require('express')
const app = express()
const { Server } = require('socket.io')
const { createServer } = require('http')
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'https://chatopia.vercel.app',
    methods: ['GET', 'POST']
  }
})

const cors = require('cors')
const createError = require('http-errors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const xss = require('xss-clean')
const path = require('path')

const mainRoute = require('./routes')
// const myCors = require('./middlewares/cors')

const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(helmet({
  crossOriginResourcePolicy: false
}))
app.use(xss())

app.use('/v1', mainRoute)

app.use('/img', express.static(path.join(__dirname, '/upload')))
app.use('/video', express.static(path.join(__dirname, '/upload')))
app.all('*', (req, res, next) => {
  // Cara 1 : bawaan package
  next(new createError.NotFound())

  // Cara 2 : Custom status & message
  // res.status(404).json({
  //     status: 404,
  //     message: 'url not found'
  // })
})

app.use((err, req, res, next) => {
  let errorMessage = err.message || 'internal server error'
  const statusCode = err.status || 500

  if (errorMessage === 'File too large') {
    errorMessage = 'File must be under 2mb'
  }

  if (errorMessage === 'Unexpected field') {
    errorMessage = 'The number of files you entered is over the limit'
  }

  res.status(statusCode).json({
    status: statusCode,
    message: errorMessage
  })
})

const messageModel = require('./models/messageModel')
const { v4: uuidv4 } = require('uuid')

io.on('connection', (socket) => {
  if (socket.handshake.query.email) {
    socket.join(socket.handshake.query.email)
    console.log(socket.handshake.query)
    console.log(`ada perankat yg terhubung dengan id ${socket.id} dan email: ${socket.handshake.query.email}`)
  } else if (socket.handshake.query.idRoom) {
    socket.join(socket.handshake.query.idRoom)
    console.log(`Grup Aktif: ${socket.handshake.query.idRoom}`)
  }

  socket.on('message', (data, callbackTest) => {
    const messageData = {
      message_id: uuidv4(),
      id_sender: `${socket.handshake.query.email}`,
      id_receiver: `${data.to}`,
      message: data.message.message
    }
    messageModel.sendMessage(messageData)
    console.log(messageData)
    console.log(`Pesannya: ${data.message.message} Tujuannya: ${data.to}`)
    callbackTest({ ...messageData, created_at: new Date() })
    socket.to(data.to).emit('messageBE', { ...messageData, created_at: new Date() })
    // socket.broadcast.emit('messageBE', {message: data, date: new Date()})
    // io.emit('messageBE', {message: data, date: new Date()})
    // socket.broadcast.to('0ffppraFNq1bEKHfAAAF').emit('messageBE', { message: data, date: new Date() })
  })

  socket.on('roomMessage', (data) => {
    console.log('room message send')
    const messageData = {
      messageId: uuidv4(),
      idRoom: `${socket.handshake.query.idRoom}`,
      idSender: `${socket.handshake.query.idSender}`,
      message: data.message
    }
    console.log(messageData)
    console.log(`Pesannya: ${data.message} Tujuannya:${socket.handshake.query.idRoom}`)
    socket.to(socket.handshake.query.idRoom).emit('roomMessageBE', { message: data.message, date: new Date() })
  })

  socket.on('delMessage', (data) => {
    console.log(data)
    messageModel.delMessage(data.message_id)

    socket.to(data.id_receiver).emit('delMessageBE', data)
  })

  socket.on('disconnect', () => {
    console.log(`ada perangkat yg terputus dengan id ${socket.id}`)
  })
})

httpServer.listen(PORT, () => {
  console.log(`server is running in port ${PORT}`)
})

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })
