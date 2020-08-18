const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const PORT = 3000 || process.env.PORT

server.listen(PORT, () => {
    console.log('Server started on port: ', PORT)
})