//Lets require/import the HTTP module
var express = require('express');
var app = express();
var http  =  require('http').Server(app);
var path = require('path');
var redis = require('socket.io-redis');

var io = require('socket.io').listen(http);
io.adapter(redis({ host: 'localhost', port: 6379 }));
//Lets define a port we want to listen to
const PORT=8080; 



// viewed at http://localhost:8080
app.get('/agent', function(req, res) {
    res.sendFile(path.join(__dirname + '/agent.html'));
});

app.get('/client', function(req, res) {
    res.sendFile(path.join(__dirname + '/client.html'));
});

// io.sockets.on('connection', function (socket, username) {
//     // When the client connects, they are sent a message
//     socket.emit('message', 'You are connected!');
//     // The other clients are told that someone new has arrived
//     socket.broadcast.emit('message', 'Another client has just connected!');

//     // As soon as the username is received, it's stored as a session variable
//     socket.on('little_newbie', function(username) {
//         socket.username = username;
//     });

//     // When a "message" is received (click on the button), it's logged in the console
//     socket.on('message', function (message) {
//         // The username of the person who clicked is retrieved from the session variables
//         console.log(socket.username + ' is speaking to me! They\'re saying: ' + message);
//     }); 
// });

// handle incoming connections from clients
io.sockets.on('connection', function(socket) {
    // once a client has connected, we expect to get a ping from them saying what room they want to join
    socket.on('room', function(room) {
        console.log(socket.username +'  joining room');
        socket.join(room);
        socket.room = room;
    });
    socket.on('little_newbie', function(username) {
        socket.username = username;
    });
    
    socket.on('message', function(message){
        socket.broadcast.to(socket.room).emit('message', socket.username + ' says: what is going on, party people?');
        //io.sockets.in(socket.room).emit('message', socket.username + ' says: what is going on, party people?');
    });
});

//Lets start our server
http.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});