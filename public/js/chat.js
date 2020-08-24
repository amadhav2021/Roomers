// Initialize a socket at the root namespace
const socket = io()

// Grab the room name parameter from the query and send to server
const params = new URLSearchParams(window.location.search)
const ROOM = params.get('room')
socket.emit('join-room', {room: ROOM})

// [TEMPORARY] Test click on title
document.querySelector('h1').addEventListener('click', () => {
    alert('Thanks for clicking!')
})

// When enter key is pressed, get message from text field and send it to server
document.querySelector('#msg').onkeydown = (e) => {
    if(e.keyCode == 13){
        val = document.querySelector('#msg').value.trim()
        document.querySelector('#msg').value = ''
        if(val !== ''){
            socket.emit('client_message', val)
        }
    }
}

// When send button is clicked, get message from text field and send it to server
document.querySelector('#send').addEventListener('click', () => {
    val = document.querySelector('#msg').value.trim()
    document.querySelector('#msg').value = ''
    if(val !== ''){
        socket.emit('client_message', val)
    }
    // Focus back on to the text field since user has clicked off of it
    document.querySelector('#msg').focus()
})

// New message received event. Add it to the chat
socket.on('new_message', data => {
    displayMessage(data)
})

// Given a message object, display the text in the chat
function displayMessage(message){
    ul = document.querySelector('.messages')
    latest = document.createElement('li')
    latest.innerHTML = `Sent at ${message.time} by ${message.name}: ${message.text}`
    ul.appendChild(latest)
}