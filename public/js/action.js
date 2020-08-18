document.querySelector('h1').addEventListener('click', () => {
    alert('Thanks for clicking!')
})

const socket = io()

socket.on('welcome', data => {
    document.querySelector('#message').innerHTML = data
})