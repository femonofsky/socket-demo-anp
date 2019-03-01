const PORT = 3000;
var app = require('express')();

var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var user_obj = {}

var count = 1;
io.on('connection', function(socket){
    var address = socket.handshake.address;
    console.log('New connection from ' + address);
    console.log("A user is connected " + count++);

    socket.broadcast.emit('hi');


    socket.on('send message', function(message) {
        console.log(user_obj[address]  + ' said : ' + message );
        io.emit('send message', user_obj[address]  + ' said : ' + message );
    });

    socket.on('get username', function(message){
        user_obj[address] = message;
        console.log(user_obj);

    })

    socket.on('input change', function() {
        // console.log("use dey type oooo")
        io.emit("input change", user_obj[address]  + ' is typing...' )
    })

    socket.on('stopped typing', function() {
        // console.log("use dey type oooo")
        io.emit("stopped typing")
    })

    
    io.on('disconnect', function () {
        console.log("user disconnected " + --count);
        console.log('connection from ' + address);
    });

});

http.listen(PORT, function(){
    console.log('Listening on * : ' + PORT);
})