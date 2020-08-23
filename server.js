// Packages and server setup
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const path = require('path')
const format = require('./utils/message')
const formatMessage = require('./utils/message')

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))
// Set view engine
app.set('view engine', 'hbs')

// Run when new connection occurs
io.on('connection', socket => {
    // Welcome the client by sending their id
    socket.emit('welcome', `Welcome to Roomers. Your id is ${socket.id}`)

    // Tell all other clients that a new socket has joined
    socket.broadcast.emit('new_message', format('Roomers Bot', 'A new user has joined'))

    // When client sends a message
    socket.on('client_message', data => {
        io.emit('new_message', format('USER', data))
    })

    // When a client leaves, notify all other clients
    socket.on('disconnect', () => {
        io.emit('new_message', format('Roomers Bot', 'A user has left the chat'))
    })
})

// Endpoints
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/chat', (req, res) => {
    res.render('chat', {room: req.query.room})
})

// Set server to listen to port
server.listen(PORT, () => {
    console.log('Server running on port ', PORT)
})
