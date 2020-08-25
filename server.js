//-------------Packages and server setup-------------//
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const path = require('path')
const format = require('./utils/message')

//-------------Constants-------------//
USER_TO_ROOM = {}
USER_TO_NAME = {}

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))
// Set view engine
app.set('view engine', 'hbs')

//-------------Endpoints-------------//
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/chat', (req, res) => {
    res.render('chat', {room: req.query.room})
})

// Run when new connection occurs
io.on('connection', socket => {

    // Add to client to room
    socket.on('join_room', data => {
        // Welcome the client
        socket.emit('new_message', format('Roomers Bot', `Welcome to room ${data.room}, ${data.name}!`))
        socket.join(data.room)
        // Tell all other clients in the room that a new socket has joined
        socket.broadcast.to(data.room).emit('new_message', format('Roomers Bot', `${data.name} just joined the chat. Say hi!`))
        // Associate user with room
        USER_TO_ROOM[socket.id] = data.room
        // Associate user with name
        USER_TO_NAME[socket.id] = data.name
        // Tell everyone in the room who the active members are
        name_list = Object.keys(io.nsps['/'].adapter.rooms[data.room].sockets).map(id => USER_TO_NAME[id])
        io.sockets.in(data.room).emit('user_list', name_list)
    })

    // When client sends a message
    socket.on('client_message', data => {
        io.sockets.in(USER_TO_ROOM[socket.id]).emit('new_message', format(USER_TO_NAME[socket.id], data))
    })

    // When a client leaves, notify all other clients
    socket.on('disconnect', () => {
        io.sockets.in(USER_TO_ROOM[socket.id]).emit('new_message', format('Roomers Bot', `${USER_TO_NAME[socket.id]} has left the chat`))
        // Remove that socket from the room
        socket.leave(USER_TO_ROOM[socket.id])
        // Update the user list for remaining room members if there are any
        if(io.nsps['/'].adapter.rooms[USER_TO_ROOM[socket.id]]){
            name_list = Object.keys(io.nsps['/'].adapter.rooms[USER_TO_ROOM[socket.id]].sockets).map(id => USER_TO_NAME[id])
            io.sockets.in(USER_TO_ROOM[socket.id]).emit('user_list', name_list)
        }
        // Remove socket.id info from tracker objects
        delete USER_TO_NAME[socket.id]
        delete USER_TO_ROOM[socket.id]
    })
})

// Set server to listen to port
server.listen(PORT, () => {
    console.log('Server running on port ', PORT)
})
