// Focus on the name so user doesn't have to click
document.querySelector("#roomInput").focus()

// Validate form before it is submitted
document.querySelector("#roomForm").addEventListener("submit", function(e){
    room = document.querySelector("#roomInput").value.trim()
    if(room === '' || room.length > 5){
        e.preventDefault(); //stop form from submitting
        document.querySelector("#roomInput").value = ''
        document.querySelector("#roomInput").focus()
    }
    else{
        document.querySelector("#roomInput").value = room
    }
});