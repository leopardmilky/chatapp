const socket = io();
function sendMessage() {
    const message = document.getElementById('message').value;
    socket.emit('chat message', message);
    return false;
}

socket.on('chat message', function(msg) {
    const item = document.createElement('li');
    item.textContent = msg;
    document.getElementById('messages').appendChild(item);
});