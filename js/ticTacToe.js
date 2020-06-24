let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
  type = "canvas"
}

PIXI.utils.sayHello(type)

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

//TODO: Make a grid of squares
//TODO: Make each square clickable and know which one is clicked

//create game screen and contents
let squareHeight = 150;
let squareWidth = 150;

gameBoard = new PIXI.Container();

let redRect = new PIXI.Graphics();
redRect.beginFill(0xFF0000);
redRect.drawRect(0,0, squareHeight, squareWidth);
redRect.interactive = true;
redRect.on('mousedown', onDown);
gameBoard.addChild(redRect);

let otherRect = new PIXI.Graphics();
otherRect.beginFill(0xDD4444);
otherRect.drawRect(200,200, squareHeight, squareWidth);
otherRect.interactive = true;
otherRect.on('click', onClick);
gameBoard.addChild(otherRect);
app.stage.addChild(gameBoard);

function onClick (eventData) {
    console.log(eventData.data);
    console.log("Clicked a square");
}

// function createGrid() {
//     var grid = {};
//     // const container = document.getElementById("container");
//     // const container = document.createElement("div");
//     // container.setAttribute('id', 'container')
//     // document.getElementsByTagName("canvas")[0].appendChild(container);
//     for (var row = 0; row < 3; row++){
//         for (var col = 0; col < 3; col++) {
//             if ((row+col) % 2 == 0){
//                 let square = new Sprite(resources["images/brown-square.png"].texture);
//                 square.height = squareHeight;
//                 square.width = squareWidth;
//                 square.x = (row+col) * 25;
//                 square.y = (row+col) * 25;
//                 $("#container").append("<div class='grid'></div>");
//                 grid[row+col] = square;
//             }
//             else {
//                 let square = new Sprite(resources["images/lightbrown-square.png"].texture);
//                 square.height = squareHeight;
//                 square.width = squareWidth;
//                 square.x = (row+col) * 25;
//                 square.y = (row+col) * 25;
//                 // $("#container").append("<div class='grid'></div>");
//                 grid[row+col] = square;
//             }
//         }
//     }
//     // $(".grid").width(960/3);
//     // $(".grid").height(960/3);
//
//     return grid;
// }
//
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
