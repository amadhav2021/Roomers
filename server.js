const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

app.get('/', (req, res) => {
    res.send('hello')
})

server.listen(PORT, () => {
    console.log('Server running on port ', PORT)
})
