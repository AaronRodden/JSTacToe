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


/*
*
*client code
*
*/
const socket = io('http://localhost:3000');
socket.on('objectMoved', placeOpponentPiece);

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

// TODO: Create a system that states all the active pieces,
// this may need to be connected to network

// or

// Have different "sets" of pieces that get activated on a clients side
// once a piece is placed

// idk which one is better (probs first one???)
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
function setupInitialPiece(stage, playerID, x = 890 , y = 100, active = true) {

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

function createNewPiece(stage, playerID, x = 890 , y = 100, active = true){
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

// TODO: Right now this works given a global object that clients see.
// Need to create an object ID system that organizes this
function placeOpponentPiece(data){
    var coordinates = data.coordinates;
    createNewPiece(app.stage, data.id, coordinates.x, coordinates.y, false);
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

    socket.emit('objectMoved', placementObject);
    socket.emit('updateGameState', placementObject);

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

    //Start the loop
    gameLoop();
});
