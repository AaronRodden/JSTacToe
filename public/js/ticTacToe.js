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
    setId(id) {
        this.id = id;
    }
}


/*
*
*client code
*
*/
const socket = io('http://localhost:3000');
socket.on('objectMoved', moveObject);

//TODO: Make each square clickable and know which one is clicked

function onClick (eventData) {
    console.log(eventData.data);
    console.log("Clicked a square");
}

function createGrid(gameBoard) {
    var columns = 3;
    var rows = 3;

    var grid = new Array(columns);
    for (var i = 0; i < grid.length; i++) {
        grid[i] = new Array(rows);
    }

    let cellSize = {
        x : 150,
        y : 150
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
            cell.interactive = true;
            cell.on('click', onClick);
            cell.drawRect(i*cellSize.x + 5.0, j*cellSize.y + 5.0, cellSize.x, cellSize.y);
            grid[i][j] = cell;
            gameBoard.addChild(cell);
        }
    }
    return grid;
}

// TODO: Right now this works given a global object that clients see.
// Need to create an object ID system that organizes this

function moveObject(data){
    // console.log(data);
    // shape.position.x = data.x;
    // shape.position.y = data.y;
    // var newPosition = this.data.getLocalPosition(this.parent);
    // this.position.x = newPosition.x;
    // this.position.y = newPosition.y;
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
    // We have postion of object at end of drag
    // console.log(this.position.x);
    // console.log(this.position.y);

    this.alpha = 1;

    this.dragging = false;

    // set the interaction data to null
    this.data = null;
}

function onDragMove()
{
    console.log("Sending: " + this.position.x + "," + this.position.y);

    var data = {
        objectID: this.id,
        x: this.position.x,
        y: this.position.y
    }

    socket.emit('objectMoved',data)

    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}

var xTexture = PIXI.Texture.fromImage('images/x.png');
var circleTexture = PIXI.Texture.fromImage('images/circle.png');

// TODO: Create a system that states all the active pieces,
// this may need to be connected to network

// or

// Have different "sets" of pieces that get activated on a clients side
// once a piece is placed

// idk which one is better (probs first one???)

function createPiece(stage, playerID) {
    var shape;
    if (playerID == 0) {
        shape = new CustomSprite(circleTexture);
        shape.setId(0);
    }
    else {
        shape = new CustomSprite(xTexture);
        shape.setId(1);
    }

    shape.widhth = 100;
    shape.height = 100;
    // enable the shape to be interactive... this will allow it to respond to mouse and touch events
   shape.interactive = true;
   // this button mode will mean the hand cursor appears when you roll over the shape with your mouse
   shape.buttonMode = true;
   // center the shape's anchor point
   shape.anchor.set(0.5);
   // make it a bit bigger, so it's easier to grab
   shape.scale.set(3);

    // setup events
    shape
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
    shape.position.x = 300;
    shape.position.y = 300;

    // add it to the stage
    stage.addChild(shape);
}

// PIXI tutorial reccomended this
let state;
state = play

var activePiece = false

function gameLoop() {
    state();
    //Call this `gameLoop` function on the next screen refresh
    //(which happens 60 times per second)
    requestAnimationFrame(gameLoop);
}

function play(){
    if (activePiece == false) {
        createPiece(app.stage, 1);
        activePiece = true
    }
}


$(document).ready(function() {
    /*
    *
    * Main game Setup
    *
    */

    // Setup game screen
    gameBoard = new PIXI.Container();
    graphicsGrid = createGrid(gameBoard);
    //Add game board to stage
    app.stage.addChild(gameBoard);

    //Start the loop
    gameLoop();
});
