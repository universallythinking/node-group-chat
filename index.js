const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { translate } = require('free-translate');


app.get('/', function(req, res) {
    res.render('index.ejs');
});



io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        translate(message, { from: 'en', to: 'es' }).then(result => {
          setTimeout(function() {
            io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + result);
          }, 5000);
        });
    });

});

const server = http.listen(process.env.PORT || 5000, function() {
    console.log('listening on *:8080');
});
