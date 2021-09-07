const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { translate } = require('free-translate');


app.get('/', function(req, res) {
    res.render('index.ejs');
});

function translateMessage(message, username) {
  translate(message, { from: 'en', to: 'es' }).then(result => {
    console.log(result);
    io.emit('chat_message', '<strong>' + username + '</strong>: ' + message);
    io.emit('chat_message', '<strong>' + username + '</strong>: ' + result);
  });
}
translateMessage("hi how are you", "univthink");

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
      translateMessage(message, socket.username);
    });

});

const server = http.listen(process.env.PORT || 5000, function() {
    console.log('listening on *:8080');
});
