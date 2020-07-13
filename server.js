let express = require('express');

let app = express();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
let server = app.listen(port);

app.use(express.static('public'));

console.log("My socket server is running");

let socket = require('socket.io');

let io = socket(server);

io.sockets.on('connection', newConnection);

let rooms = [];

function newConnection(socket) {

    // TODO: I think this is where we can handle rooms
    // On connect we open up a new room and add to map? vector?
    // (idk if we will need to be able to keep track of specific rooms in any way)
    // This way the client code (ticTacToe.js) is mostly just the same
    // it will now recieve a room id and always emit to that room id

    // will we have to create an object for every room and add those to some data structure??

    // http://psitsmike.com/2011/10/node-js-and-socket-io-multiroom-chat-tutorial/

    // There is going to be a new screen / html elements before game
    // it will ask players to host or join
        // if a player hosts they choose a room name, then an event is emited to server
        // store room name in the socket session for this client (socket.room = <room name>)
        // add room name to array / map / whatever
        // the server uses socket.join(<room name>) to connect socket to room
        // now broadcast to that room name always
            // can use socket.broadcast.to(socket.room).emit() ????

        // if a player joins they are prompted to enter in a room name
        // on entering a name an event is emitted to server
        // serch to see if that room name exists, and report back
        // if viable room, store room name in the socket session for this client (socket.room = <room name>)
        // server uses socket.join(<room name>) to connect
        // now broadcast to that room name

    // ... does every conenction have their own 'instance' of this server code.
    // will above plan work for more than 1 room?

    console.log('new connection: ' + socket.id);
    console.log("Avaliable rooms: " + rooms);

    socket.on('hostGame', hostGame);

    function hostGame(roomName){
        socket.room = roomName;
        rooms.push(roomName);
        socket.join(roomName);
    }

    socket.on('joinGame', joinGame);

    function joinGame(roomName, fn) {
        if (rooms.includes(roomName)) {
            socket.room = roomName;
            socket.join(roomName);
        }
        else {
            fn();
        }
    }

    socket.on('objectMoved', objectMoved);

    function objectMoved(data){
        console.log(data);
        socket.broadcast.to(socket.room).emit('objectMoved', data); //broadcast to everyone BUT client that sent msg
        // io.sockets.emit('objectMoved', data); //broadcast to EVERYONE
    }

    socket.on('resetPressed', resetPressed);

    function resetPressed() {
        socket.broadcast.to(socket.room).emit('resetPressed');
    }

    // TODO: Handle disconnecting and destroying rooms

    // socket.on('disconnect', disconnect);

    // in the future we only want to close off room when host leaves
    // function disconnect(){
    //     console.log("handling disconnect");
	// 	delete rooms[socket.room];
    // }
}
