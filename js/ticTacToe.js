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

//console.log(app.renderer.view.width);
//console.log(app.renderer.view.height);

// app.renderer.autoDensity = true;
// app.renderer.resize(512, 512);

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

console.log(app.stage);
//can use .add to load multiple images

let squareHeight = 150;
let squareWidth = 150;
const container = document.getElementById("container");

function createGrid() {
    var grid = {};
    for (var i = 0; i < 9; i++){
        if ((i % 2) == 0) {
            let square = new Sprite(resources["images/brown-square.png"].texture);
            square.height = squareHeight;
            square.width = squareWidth;
            square.x = i * 25;
            square.y = i * 25;
            grid[i] = square;

        }
        else {
            let square = new Sprite(resources["images/lightbrown-square.png"].texture);
            square.height = squareHeight;
            square.width = squareWidth;
            square.x = i * 25;
            square.y = i * 25;
            grid[i] = square;
        }
    }
    return grid;
}

PIXI.loader
  .add("images/brown-square.png")
  .add("images/lightbrown-square.png")
  .load(setup);


function setup() {
    console.log("All sprites loaded");
    // let brownSquare = new Sprite(resources["images/brown-square.png"].texture);
    // let lightBrownSquare = new Sprite(resources["images/lightbrown-square.png"].texture);
    //
    // brownSquare.scale.x = 0.125;
    // brownSquare.scale.y = 0.125;
    // lightBrownSquare.height = brownSquare.height;
    // lightBrownSquare.width = brownSquare.width;
    //
    // lightBrownSquare.position.set(90,180);
    //
    // app.stage.addChild(brownSquare);
    // app.stage.addChild(lightBrownSquare);
    grid = createGrid();
    console.log(grid);

    for (x in grid){
        app.stage.addChild(grid[x]);
    }

  // sprite.visible = false;
}
