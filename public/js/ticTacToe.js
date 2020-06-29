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
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}

var xTexture = PIXI.Texture.fromImage('images/x.png');
var circleTexture = PIXI.Texture.fromImage('images/circle.png');

function createPiece(stage, playerID) {
    var shape;
    if (playerID == 0) {
        shape = new PIXI.Sprite(circleTexture);
    }
    else {
        shape = new PIXI.Sprite(xTexture);
    }

    shape.widhth = 100;
    shape.height = 100;
    // shape.scale.set(0.00125,0.00125);
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


/*
*
* Sprite loading example
*/

// PIXI.loader
//   .add("images/brown-square.png")
//   .add("images/lightbrown-square.png")
//   .load(setup);
//
//
// function setup() {
//     console.log("All sprites loaded");
//     grid = createGrid();
//     console.log(grid);
//
//     for (x in grid){
//         app.stage.addChild(grid[x]);
//     }
//     console.log(app.stage);
// }
