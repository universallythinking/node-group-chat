process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { translate } = require('free-translate');


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
    res.render('index.ejs');
});
var i;


//var port;
app.get('/sendMessage', function(req, res) {
    var username = "univthink";
    var message = req.query.body;
    translate(message, { from: 'en', to: 'es' }).then(result => {
      //io.emit('chat_message', '<strong>' + username + '</strong>: ' + message);
      console.log(message, result);
      io.sockets.emit('chat_message', '<strong>' + username + '</strong>: ' + message + '<br><br>' + result);
    });
    res.sendStatus(200);
});

function translateMessage(message, username) {
  translate(message, { from: 'en', to: 'es' }).then(result => {
    //io.emit('chat_message', '<strong>' + username + '</strong>: ' + message);
    console.log(message, result);
    io.sockets.emit('chat_message', '<strong>' + username + '</strong>: ' + message + '<br><br>' + result);
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
      io.emit('chat_message', '<strong>' + username + '</strong>: ' + message + '<br><br>' + result);
      translateMessage(message, socket.username);
    });

});

const server = http.listen(process.env.PORT || 5000, function() {
    //port = server.address().port;
    console.log(server.address().port);
});


/*app.get('/port', function(req, res) {
    res.send({"body": port});
});*/
