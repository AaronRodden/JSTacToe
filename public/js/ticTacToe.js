/*
*
* PIXI Setup
*
*/
let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

//Aliases
let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

//Create a Pixi Application
let app = new Application({
    width: 256,         // default: 800
    height: 256,        // default: 600
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1       // default: 1
  }
);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

app.renderer.backgroundColor = 0x061639;

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

// Custom PIXI classes
class CustomSprite extends PIXI.Sprite {
    setID(id) {
        this.id = id;
    }
}

class GameState {
    constructor(columns, rows) {
        this.grid = new Array(columns);
        for (var i = 0; i < this.grid.length; i++) {
            this.grid[i] = new Array(rows);
        }
    }

    // TODO: I want to change how this is done eventually but this works for now.
    checkVictory(){
        var victory = -1
        if ((this.grid[0][0] == 0 && this.grid[0][1] == 0 && this.grid[0][2] == 0)
            || (this.grid[0][0] == 1 && this.grid[0][1] == 1 && this.grid[0][2] == 1)) {
            victory = this.grid[0][0];
        }
        else if ((this.grid[1][0] == 0 && this.grid[1][1] == 0 && this.grid[1][2] == 0)
            || (this.grid[1][0] == 1 && this.grid[1][1] == 1 && this.grid[1][2] == 1)) {
            victory = this.grid[1][0];
        }
        else if ((this.grid[2][0] == 0 && this.grid[2][1] == 0 && this.grid[2][2] == 0)
            || (this.grid[2][0] == 1 && this.grid[2][1] == 1 && this.grid[2][2] == 1)) {
            victory = this.grid[2][0];
        }
        // col victories
        else if ((this.grid[0][0] == 0 && this.grid[1][0] == 0 && this.grid[2][0] == 0)
            || (this.grid[0][0] == 1 && this.grid[1][0] == 1 && this.grid[2][0] == 1)) {
            victory = this.grid[0][0];
        }
        else if ((this.grid[0][1] == 0 && this.grid[1][1] == 0 && this.grid[2][1] == 0)
            || (this.grid[0][1] == 1 && this.grid[1][1] == 1 && this.grid[2][1] == 1)) {
            victory = this.grid[0][1];
        }
        else if ((this.grid[0][2] == 0 && this.grid[0][2] == 0 && this.grid[2][2] == 0)
            || (this.grid[0][2] == 1 && this.grid[0][2] == 1 && this.grid[2][2] == 1)) {
            victory = this.grid[0][2];
        }
        // diagonal victories
        else if ((this.grid[0][0] == 0 && this.grid[1][1] == 0 && this.grid[2][2] == 0)
            || (this.grid[0][0] == 1 && this.grid[1][1] == 1 && this.grid[2][2] == 1)) {
            victory = this.grid[0][0];
        }
        else if ((this.grid[2][0] == 0 && this.grid[1][1] == 0 && this.grid[0][2] == 0)
            || (this.grid[2][0] == 1 && this.grid[1][1] == 1 && this.grid[0][2] == 1)) {
            victory = this.grid[2][0];
        }
        return victory;
    }

    updateGrid(id, col, row){
        this.grid[col][row] = id;
    }
}

/*
*
*client code
*
*/
const socket = io('http://localhost:3000');
socket.on('objectMoved', recieveOpponentMove);

var grid;
function createGrid(gameBoard) {
    var columns = 3;
    var rows = 3;

    grid = new Array(columns);
    for (var i = 0; i < grid.length; i++) {
        grid[i] = new Array(rows);
    }

    let cellSize = {
        x : 200,
        y : 200
    }

    for (var i = 0; i < columns; i++) {
        for (var j = 0; j < rows; j++) {
            let cell = new PIXI.Graphics();
            if ((i+j) % 2 == 0) {
                cell.beginFill(0x8B4513);
            }
            else {
                cell.beginFill(0xFFF8DC);
            }
            cell.drawRect(i*cellSize.x + 5.0, j*cellSize.y + 5.0, cellSize.x, cellSize.y);
            grid[i][j] = {
                x : i*cellSize.x + 5.0,
                y : j*cellSize.y + 5.0,
                width : cellSize.x,
                height : cellSize.y
            }
            gameBoard.addChild(cell);
        }
    }
}

var activePieces = new Array();

var chessPiecesSheet;
function setupPieceSprites() {
    loader
      .add("images/chess-pieces-sprites.png")
      .load(setup);

    function setup() {
        chessPiecesSheet = PIXI.utils.TextureCache['images/chess-pieces-sprites.png'];
    }
}

var chessPiecesSheet
function setupInitialPiece(stage, playerID, x = 890 , y = 200, active = true) {

    loader
      .add("images/chess-pieces-sprites.png")
      .load(setup);

    function setup() {
        chessPiecesSheet = PIXI.utils.TextureCache['images/chess-pieces-sprites.png'];
        var piece;
        // white piece
        if (playerID == 0) {
            let rect = new PIXI.Rectangle(1000,10,200,200);
            chessPiecesSheet.frame = rect;
            piece = new CustomSprite(chessPiecesSheet);
            piece.setID(0);
        }
        // black piece
        else {
            let rect = new PIXI.Rectangle(1000,200,200,200);
            chessPiecesSheet.frame = rect;
            piece = new CustomSprite(chessPiecesSheet);
            piece.setID(1);
        }
        // enable the shape to be interactive... this will allow it to respond to mouse and touch events
        piece.interactive = active;
        // this button mode will mean the hand cursor appears when you roll over the shape with your mouse
        piece.buttonMode = active;
        // center the shape's anchor point
        piece.anchor.set(0.5);
        // setup events
        piece
            // events for drag start
            .on('mousedown', onDragStart)
            .on('touchstart', onDragStart)
            // events for drag end
            .on('mouseup', onDragEnd)
            .on('mouseupoutside', onDragEnd)
            .on('touchend', onDragEnd)
            .on('touchendoutside', onDragEnd)
            // events for drag move
            .on('mousemove', onDragMove)
            .on('touchmove', onDragMove);

        // move the sprite to its designated position
        piece.position.x = x;
        piece.position.y = y;

        // set active piece flag
        activePiece = true;

        app.stage.addChild(piece);
    }
}

function createNewPiece(stage, playerID, x = 890 , y = 200, active = true){
    let texture = chessPiecesSheet.clone();

    if (playerID == 0){
        let rect = new PIXI.Rectangle(1000,10,200,200);
        texture.frame = rect;
        piece = new CustomSprite(texture);
        piece.setID(0);
    }
    else {
        let rect = new PIXI.Rectangle(1000,200,200,200);
        texture.frame = rect;
        piece = new CustomSprite(texture);
        piece.setID(1);
    }
    // enable the shape to be interactive... this will allow it to respond to mouse and touch events
    piece.interactive = active;
    // this button mode will mean the hand cursor appears when you roll over the shape with your mouse
    piece.buttonMode = active;
    // center the shape's anchor point
    piece.anchor.set(0.5);
    // setup events
    piece
        // events for drag start
        .on('mousedown', onDragStart)
        .on('touchstart', onDragStart)
        // events for drag end
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        // events for drag move
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);
    piece.position.x = x;
    piece.position.y = y;
    activePiece = true;
    app.stage.addChild(piece);
}

function checkPiecePlacement(id, x, y) {
    var columns = 3;
    var rows = 3;
    for (var i = 0; i < columns; i++){
        for (var j = 0; j < rows; j++) {
            var cell = grid[i][j];
            if (x >= cell.x && x <= cell.width + cell.x &&
                y >= cell.y && y <= cell.height + cell.y){
                console.log("Piece placed within cell:");
                console.log(cell);
                // TODO: center the piece withing that cell
                // then return the x, y of that centering

                // additionally, return the indicies of the grid for
                // game state updates
                const coordinates = {
                    x : x,
                    y: y
                }
                const indicies = {
                    col : i,
                    row: j
                }

                return {
                    id : id,
                    coordinates : coordinates,
                    indicies : indicies
                }
            }
        }
    }
}

function recieveOpponentMove(data){
    // Update local board via opponents network input
    var coordinates = data.coordinates;
    createNewPiece(app.stage, data.id, coordinates.x, coordinates.y, false);

    // update game state
    gameState.updateGrid(data.id, data.indicies.col, data.indicies.row);
    if (gameState.checkVictory() > -1) {
        victory(gameState.checkVictory());
    }
}

function onDragStart(event)
{
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;

    var placementObject = checkPiecePlacement(this.id, this.position.x, this.position.y);

    // Update local board via local input
    gameState.updateGrid(playerID, placementObject.indicies.col, placementObject.indicies.row);
    if (gameState.checkVictory() > -1) {
        victory(gameState.checkVictory());
    }

    socket.emit('objectMoved', placementObject);

    // if piece was placed on a square make it non interactable
    this.interactive = false;
    this.buttonMode = false;

    //set activePiece flag
    activePiece = false;

    // set the interaction data to null
    this.data = null;
}

function onDragMove()
{

    // change position on screen then send that info over network
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}

function victory(playerID) {
    let victoryText = new PIXI.Text("Victory for player " + playerID + "!!!",
    {fontFamily : 'Arial', fontSize: 124, fill : 0xff1010, align : 'center'});
    app.stage.addChild(victoryText);
}

// PIXI tutorial reccomended this
let state;
state = play

var activePiece;

function gameLoop() {
    state();
    //Call this `gameLoop` function on the next screen refresh
    //(which happens 60 times per second)
    requestAnimationFrame(gameLoop);
}

function play(){
    if (activePiece == false){
        createNewPiece(app.stage, playerID);
    }
}

var playerID;
var gameState;
$(document).ready(function() {
    /*
    *
    * Main game Setup
    *
    */

    // TEST
    playerID = parseInt(prompt("Please enter your playerID"));

    // Setup game screen
    gameBoard = new PIXI.Container();
    createGrid(gameBoard);
    setupInitialPiece(app.stage, playerID);
    //Add game board to stage
    app.stage.addChild(gameBoard);

    //Initialize game state
    gameState = new GameState(3,3);

    //Start the loop
    gameLoop();
});
