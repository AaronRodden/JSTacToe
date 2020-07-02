
class GameState {
    constructor(columns, rows) {
        this.grid = new Array(columns);
        for (var i = 0; i < this.grid.length; i++) {
            this.grid[i] = new Array(rows);
        }
    }

    updateGrid(id, col, row){
        this.grid[col][row] = id;
    }
}

var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log("My socket server is running");

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log('new connection: ' + socket.id);
    //Initialize game state
    let state = new GameState(3,3);

    socket.on('objectMoved', objectMoved);
    socket.on('updateGameState', updateState);

    function objectMoved(data){
        console.log(data);
        socket.broadcast.emit('objectMoved', data); //broadcast to everyone BUT client that sent msg
        // io.sockets.emit('objectMoved', data); //broadcast to EVERYONE
    }

    function updateState(data){
        console.log("Updating shared game state");
        console.log(data);
        state.updateGrid(data.id, data.indicies.col, data.indicies.row);
    }
}
