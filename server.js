// Packages and server setup
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const path = require('path')
const format = require('./utils/message')

// Constants
USER_TO_ROOM = {}

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))
// Set view engine
app.set('view engine', 'hbs')

// Endpoints
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/chat', (req, res) => {
    res.render('chat', {room: req.query.room})
})

// Run when new connection occurs
io.on('connection', socket => {

    // Add to client to room
    socket.on('join-room', data => {
        // Welcome the client
        socket.emit('new_message', format('Roomers Bot', `Welcome to room ${data.room}!`))
        socket.join(data.room)
        // Tell all other clients in the room that a new socket has joined
        socket.broadcast.to(data.room).emit('new_message', format('Roomers Bot', 'A new user has joined'))
        // Associate user with room
        USER_TO_ROOM[socket.id] = data.room
    })

    // When client sends a message
    socket.on('client_message', data => {
        io.sockets.in(USER_TO_ROOM[socket.id]).emit('new_message', format('USER', data))
    })

    // When a client leaves, notify all other clients
    socket.on('disconnect', () => {
        io.sockets.in(USER_TO_ROOM[socket.id]).emit('new_message', format('Roomers Bot', 'A user has left the chat'))
        // Remove that socket from the room
        delete USER_TO_ROOM[socket.id]
    })
})

// Set server to listen to port
server.listen(PORT, () => {
    console.log('Server running on port ', PORT)
})
