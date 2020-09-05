// Initialize a socket at the root namespace
const socket = io()

// Prompt for a name [CHANGE TO MODAL DISPLAY LATER]
var username = 'Paul'
// var username = prompt('Give us a name so others know who you are!')
// while(username === null){
//     username = prompt('Give us a name so others know who you are!')
// }

// Grab the room name parameter from the query and send to server
const params = new URLSearchParams(window.location.search)
const ROOM = params.get('room')
socket.emit('join_room', {room: ROOM, name: username})

// When enter key is pressed, get message from text field and send it to server
document.querySelector('#inputMsg').onkeydown = (e) => {
    if(e.keyCode == 13){
        val = document.querySelector('#inputMsg').value.trim()
        document.querySelector('#inputMsg').value = ''
        if(val !== ''){
            socket.emit('client_message', val)
        }
    }
}

// When send button is clicked, get message from text field and send it to server
document.querySelector('#sendMsg').addEventListener('click', () => {
    val = document.querySelector('#inputMsg').value.trim()
    document.querySelector('#inputMsg').value = ''
    if(val !== ''){
        socket.emit('client_message', val)
    }
    // Focus back on to the text field since user has clicked off of it
    document.querySelector('#inputMsg').focus()
})

// New message received event. Add it to the chat
socket.on('new_message', data => {
    displayMessage(data)
})

// When user list is received, update the display
socket.on('user_list', list => {
    ul = document.querySelector('#userList')
    ul.innerHTML = ''
    list.forEach((user) => {
        ul = document.querySelector('#userList')
        li = document.createElement('li')
        li.innerHTML = user
        ul.appendChild(li)
    })
})

// Given a message object, display the text in the chat
function displayMessage(message){
    chat = document.querySelector('.chat')
    newMessage = document.createElement('div')
    newMessage.classList.add('message')
    newMessage.innerHTML = `Sent at ${message.time} by ${message.name}: ${message.text}`
    chat.appendChild(newMessage)
}