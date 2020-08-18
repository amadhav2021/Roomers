// Packages and server setup
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const path = require('path')

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))
// Set view engine
app.set('view engine', 'hbs')

// Run when new connection occurs
io.on('connection', socket => {
    socket.emit('welcome', `Welcome to Roomers. Your id is ${socket.id}`)
})

// Endpoints
app.get('/', (req, res) => {
    res.render('index')
})

// Set server to listen to port
server.listen(PORT, () => {
    console.log('Server running on port ', PORT)
})
