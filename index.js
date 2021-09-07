const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const translate = require("translate");
translate.engine = "libre";
app.get('/', function(req, res) {
    res.render('index.ejs');
});

const translateMessage = async function(message) {
  const translatedMessage = await translate(message, "es");
  return translatedMessage;
}

io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
    })

    socket.on('chat_message', function(message) {
        translatedContent = translateMessage(message);
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + translatedContent);
    });

});

const server = http.listen(process.env.PORT || 5000, function() {
    console.log('listening on *:8080');
});
