// Initialize a socket at the root namespace
const socket = io()

// Focus on the username input field
document.querySelector('#username').focus()

// Grab the room name parameter from the query and send to server
const params = new URLSearchParams(window.location.search)
const ROOM = params.get('room')

// Provide join information
document.querySelector('#joinInfo').innerHTML = `JOIN: <span style='color: #1591c6;'>${window.location.href}</span> or enter '${ROOM}' from main lobby`

// When username is entered, join room with that name
document.querySelector('#submitName').addEventListener('click', () => {
    username = document.querySelector('#username').value.trim()
    if(username === ''){
        document.querySelector('#username').value = ''
        document.querySelector('#username').focus()
    }
    else{
        socket.emit('join_room', {room: ROOM, name: username})
        document.querySelector('.modal-bg').style.display = 'none';
    }
})

// When entery key is pressed on username input, join room with that name
document.querySelector('#username').onkeydown = (e) => {
    if(e.keyCode == 13){
        username = document.querySelector('#username').value.trim()
        if(username === ''){
            document.querySelector('#username').value = ''
            document.querySelector('#username').focus()
        }
        else{
            socket.emit('join_room', {room: ROOM, name: username})
            document.querySelector('.modal-bg').style.display = 'none';
        }
    } 
}

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

    // Autoscroll
    chat = document.querySelector('.chat')
    chat.scrollTop = chat.scrollHeight
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
    color = '#37e79e'
    if(message.name === "Roomers Bot"){
        color = '#74dcfc'
    }
    newMessage.innerHTML = `<p class="msgInfo" style='background-color: ${color};'>${message.name}<span style="float: right;">${message.time}</span></p>
    <p class="content">${message.text}</p>`
    chat.appendChild(newMessage)
}