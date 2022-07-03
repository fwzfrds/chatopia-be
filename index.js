require('dotenv').config()

const express = require('express')
const app = express()
const { Server } = require('socket.io')
const { createServer } = require('http')
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
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
app.use(cors({
  credentials: true,
  // origin: ['http://localhost:3000', 'https://recipedia-ashen.vercel.app', 'https://pijarnext-fwzfrds.vercel.app/']
  origin: [
    'https://pijarnext-fwzfrds.vercel.app',
    'http://localhost:3000'
  ]
}))
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

io.on('connection', (socket) => {
  console.log(`ada perankat yg terhubung dengan id ${socket.id} dan username: ${socket.handshake.query.id}`)
  socket.join(socket.handshake.query.id)
  // console.log(socket.handshake.query)
  socket.on('message', (data) => {
    console.log(`Pesannya: ${data.message} Tujuannya: ${data.to}`)
    socket.to(data.to).emit('messageBE', { message: data.message, date: new Date() })
    // socket.broadcast.emit('messageBE', {message: data, date: new Date()})
    // io.emit('messageBE', {message: data, date: new Date()})
    // socket.broadcast.to('0ffppraFNq1bEKHfAAAF').emit('messageBE', { message: data, date: new Date() })
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
