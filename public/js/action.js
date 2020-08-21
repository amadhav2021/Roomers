document.querySelector('h1').addEventListener('click', () => {
    alert('Thanks for clicking!')
})

document.querySelector('#msg').onkeydown = (e) => {
    if(e.keyCode == 13){
        val = document.querySelector('#msg').value.trim()
        document.querySelector('#msg').value = ''
        if(val !== ''){
            socket.emit('client_message', val)
        }
    }
}

document.querySelector('#send').addEventListener('click', () => {
    val = document.querySelector('#msg').value.trim()
    document.querySelector('#msg').value = ''
    if(val !== ''){
        socket.emit('client_message', val)
    }
})

const socket = io()

socket.on('welcome', data => {
    document.querySelector('#server_msg').innerHTML = data
})

socket.on('new_message', data => {
    ul = document.querySelector('.messages')
    latest = document.createElement('li')
    latest.innerHTML = data
    ul.appendChild(latest)
})